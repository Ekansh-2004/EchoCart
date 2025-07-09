import cron from "node-cron";
import say from "say";
import Product from "../models/product.model.js";

class AIStockMonitor {
	constructor(io) {
		this.io = io;
		this.isActive = false;
		this.checkInterval = 15; 
		this.cronJob = null;
		this.thresholds = {
			empty: 0,
			low: 5,
			high: 100
		};
		this.isSpeaking = false; // Track if TTS is currently active
	}

	start(intervalMinutes = 15) {
		if (this.isActive) {
			console.log("🤖 AI Stock Monitor is already running");
			return;
		}

		this.checkInterval = intervalMinutes;
		this.isActive = true;

		// Create cron expression for the specified interval
		const cronExpression = `*/${intervalMinutes} * * * *`;
		
		this.cronJob = cron.schedule(cronExpression, () => {
			this.performStockCheck();
		});

		console.log(`🤖 AI Stock Monitor started - checking every ${intervalMinutes} minutes`);
		
		// Perform initial check
		this.performStockCheck();
	}

	stop() {
		if (!this.isActive) {
			console.log("🤖 AI Stock Monitor is already stopped");
			return;
		}

		if (this.cronJob) {
			this.cronJob.destroy();
			this.cronJob = null;
		}

		this.isActive = false;
		this.isSpeaking = false;
		console.log("🤖 AI Stock Monitor stopped");
	}

	async performStockCheck() {
		try {
			console.log("🔍 AI performing stock analysis...");
			
			const products = await Product.find();
			const alerts = this.analyzeStock(products);
			
			if (alerts.length > 0) {
				// Send alerts to connected clients
				this.io.emit('stockAlert', alerts);
				
				// Generate voice alerts with proper sequencing
				await this.generateVoiceAlerts(alerts);
				
				console.log(`🚨 Generated ${alerts.length} stock alerts`);
			} else {
				console.log("✅ All stock levels are optimal");
			}
			
		} catch (error) {
			console.error("❌ Error during stock check:", error);
		}
	}

	analyzeStock(products) {
		const alerts = [];
		
		products.forEach(product => {
			const quantity = product.quantity || 0;
			
			if (quantity === this.thresholds.empty) {
				alerts.push({
					type: 'empty',
					severity: 'critical',
					product: product.name,
					quantity: quantity,
					message: `${product.name} is completely out of stock!`,
					recommendation: 'Immediate restocking required'
				});
			} else if (quantity <= this.thresholds.low && quantity > 0) {
				alerts.push({
					type: 'low',
					severity: 'warning',
					product: product.name,
					quantity: quantity,
					message: `${product.name} is running low (${quantity} remaining)`,
					recommendation: 'Consider restocking soon'
				});
			} else if (quantity >= this.thresholds.high) {
				alerts.push({
					type: 'overstocked',
					severity: 'info',
					product: product.name,
					quantity: quantity,
					message: `${product.name} appears to be overstocked (${quantity} units)`,
					recommendation: 'Monitor for potential waste'
				});
			}
		});
		
		return alerts;
	}

	async generateVoiceAlerts(alerts) {
		const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
		const warningAlerts = alerts.filter(alert => alert.severity === 'warning');
		
		// Process critical alerts first
		if (criticalAlerts.length > 0) {
			const message = this.createVoiceMessage(criticalAlerts, 'critical');
			await this.speakAlert(message, 'critical');
		}
		
		// Process warning alerts after critical alerts are done
		if (warningAlerts.length > 0) {
			const message = this.createVoiceMessage(warningAlerts, 'warning');
			// Wait for critical alerts to finish before speaking warnings
			const delay = criticalAlerts.length > 0 ? 4000 : 0;
			setTimeout(async () => {
				await this.speakAlert(message, 'warning');
			}, delay);
		}
	}

	createVoiceMessage(alerts, severity) {
		if (severity === 'critical') {
			if (alerts.length === 1) {
				return `Critical alert! ${alerts[0].product} is completely out of stock and requires immediate restocking.`;
			} else {
				// List each product individually for critical alerts
				const productList = alerts.map(alert => `${alert.product} is out of stock`).join(', ');
				return `Critical alert! Multiple products are out of stock: ${productList}. Immediate restocking required for all items.`;
			}
		} else if (severity === 'warning') {
			if (alerts.length === 1) {
				return `Warning: ${alerts[0].product} is running low with only ${alerts[0].quantity} units remaining. Consider restocking soon.`;
			} else {
				// List each product with its quantity for warning alerts
				const productDetails = alerts.map(alert => 
					`${alert.product} has ${alert.quantity} units remaining`
				).join(', ');
				return `Warning: Multiple products are running low. ${productDetails}. Consider restocking these items soon.`;
			}
		}
	}

	async speakAlert(message, severity) {
		return new Promise((resolve, reject) => {
			try {
				// Prevent overlapping speech
				if (this.isSpeaking) {
					console.log('⏳ Speech already in progress, queuing message...');
					setTimeout(() => {
						this.speakAlert(message, severity).then(resolve).catch(reject);
					}, 1000);
					return;
				}

				this.isSpeaking = true;
				console.log(`🔊 Speaking ${severity} alert: ${message}`);

				const voice = process.platform === 'darwin' ? 'Samantha' : null;
				const speed = severity === 'critical' ? 0.75 : 0.7; // Slightly slower for better clarity
				
				say.speak(message, voice, speed, (err) => {
					this.isSpeaking = false;
					if (err) {
						console.error('❌ Error speaking alert:', err);
						reject(err);
					} else {
						console.log(`✅ Finished speaking ${severity} alert`);
						resolve();
					}
				});
			} catch (error) {
				this.isSpeaking = false;
				console.error('❌ Text-to-speech error:', error);
				reject(error);
			}
		});
	}

	getStatus() {
		return {
			isActive: this.isActive,
			checkInterval: this.checkInterval,
			thresholds: this.thresholds,
			isSpeaking: this.isSpeaking
		};
	}

	updateThresholds(newThresholds) {
		this.thresholds = { ...this.thresholds, ...newThresholds };
		console.log('🔧 Updated stock thresholds:', this.thresholds);
	}

	// Method to stop current speech (useful for emergency stops)
	stopSpeaking() {
		if (this.isSpeaking) {
			try {
				say.stop();
				this.isSpeaking = false;
				console.log('🔇 Stopped current speech');
			} catch (error) {
				console.error('❌ Error stopping speech:', error);
			}
		}
	}
}

export default AIStockMonitor;