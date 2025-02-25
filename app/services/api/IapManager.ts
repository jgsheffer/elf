import * as RNIap from 'react-native-iap';
import DeviceInfo from 'react-native-device-info';
import { Platform } from "react-native"

class IapManager 
{
  private isInitialized: boolean = false;
  private isEmulator: boolean = false;
  private subscriptionIds: string[] = ["test_sub", "test_sub_new","base_membership", "tier_1_membership", "tier_2_membership"];

  private purchaseUpdateSubscription: ReturnType<typeof RNIap.purchaseUpdatedListener> | null = null;
  private purchaseErrorSubscription: ReturnType<typeof RNIap.purchaseErrorListener> | null = null;


  async initialize() {
    if (this.isInitialized) return;

    this.isEmulator = await DeviceInfo.isEmulator();
    if (this.isEmulator) {
      console.warn("In-App Purchases are not supported on emulators.");
      return;
    }

    try {
      console.log("Initializing IAP...");
      await RNIap.initConnection();
      this.isInitialized = true;
      console.log("IAP Initialized successfully.");
    } catch (error) {
      console.error('Error initializing IAP:', error);
    }
  }

  async getSubscriptions() {
    if (!this.isInitialized) {
      console.warn("IAP is not initialized.");
      return [];
    }

    try {
      const subscriptions = await RNIap.getSubscriptions({ skus: this.subscriptionIds });
      return subscriptions;
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  async checkActiveSubscription() {
    if (!this.isInitialized) {
      console.warn("IAP is not initialized.");
      return false;
    }

    try {
      const purchases = await RNIap.getAvailablePurchases();
      const activeSubscription = purchases.some(purchase => this.subscriptionIds.includes(purchase.productId) && purchase.transactionReceipt);
      return activeSubscription;
    } catch (error) {
      console.error('Error checking active subscriptions:', error);
      return false;
    }
  }

  async purchaseSubscription(level: number) {
    if (!this.isInitialized) {
      console.error("IAP is not initialized.");
      return false;
    }

    try {
      console.log("Requesting Purchase!");
      const subs = await this.getSubscriptions();
      if(level >= subs.length)
      {
        console.log("Subscription purchase level not found!", "Level", level, "subLength:", subs.length);
        return false;
      }

      if(Platform.OS === 'android')
      {
        console.log("Creating offer details...");
        const subAnd = subs[level] as RNIap.SubscriptionAndroid;

        if (!subAnd.subscriptionOfferDetails || subAnd.subscriptionOfferDetails.length === 0) {
          console.log("No subscription offer details found for this product.");
          return false;
        }

        let subscriptionOffers: { sku: string; offerToken: string }[] = [];
        subAnd.subscriptionOfferDetails.map((offerDetails) => {
          const subscriptionOffer ={
            sku: subAnd.productId,
            offerToken: offerDetails.offerToken
          }
          subscriptionOffers.push(subscriptionOffer);
          console.log("Added offer sku", subscriptionOffer.sku, "OfferID:", offerDetails.offerId, "basePlan:", offerDetails.basePlanId);
        });
        
        console.log("Trying to purchase Android product:",subAnd.productId, );
        await RNIap.requestSubscription({ sku:subAnd.productId, subscriptionOffers:[subscriptionOffers[0]] });
      }
      else
      {
        console.error("Trying to purchase iOS sub...");
        await RNIap.requestSubscription({ sku: subs[level].productId });
      }

      return true;
    } 
    catch (error) 
    {
      console.error('Error purchasing subscription:', error.message);
      return false;
    }
  }

  purchaseUpdateListener(callback: (purchase: RNIap.ProductPurchase) => void) {
    if (this.purchaseUpdateSubscription) {
      console.warn("Purchase update listener is already set.");
      return;
    }
    this.purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(callback);
    return this.purchaseUpdateSubscription;
  }

  purchaseErrorListener(callback: (error: any) => void) {
    if (this.purchaseErrorSubscription) {
      console.warn("Purchase error listener is already set.");
      return;
    }
    this.purchaseErrorSubscription = RNIap.purchaseErrorListener(callback);
    return this.purchaseErrorSubscription;
  }

  removeListeners() {
    if (this.purchaseUpdateSubscription) {
      this.purchaseUpdateSubscription.remove();
      console.log("Purchase update listener removed.");
    }

    if (this.purchaseErrorSubscription) {
      this.purchaseErrorSubscription.remove();
      console.log("Purchase error listener removed.");
    }

    this.purchaseUpdateSubscription = null;
    this.purchaseErrorSubscription = null;
  }

  async endConnection() {
    if (this.isInitialized) {
      try {
        await RNIap.endConnection();
        console.log("IAP connection closed.");
        this.isInitialized = false;
      } catch (error) {
        console.error('Error closing IAP connection:', error);
      }
    }
  }
}
export const iapManager = new IapManager()