/**
 * Format currency values
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (default: USD)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'EGP') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode
    }).format(amount);
  };
  
  /**
   * Calculate deposit amount based on percentage
   * @param {number} totalAmount - The total booking amount
   * @param {number} percentage - Deposit percentage (default: 30)
   * @returns {number} - Calculated deposit amount
   */
  export const calculateDeposit = (totalAmount, percentage = 30) => {
    return (totalAmount * (percentage / 100)).toFixed(2);
  };
  
  /**
   * Format date string to localized format
   * @param {string} dateString - ISO date string
   * @returns {string} - Formatted date string
   */
  export const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  /**
   * Validate credit card number (simple Luhn algorithm check)
   * @param {string} cardNumber - Credit card number
   * @returns {boolean} - True if valid
   */
  export const validateCardNumber = (cardNumber) => {
    // Remove non-digit characters
    const digits = cardNumber.replace(/\D/g, '');
    
    if (digits.length < 13 || digits.length > 19) {
      return false;
    }
    
    // Luhn algorithm
    let sum = 0;
    let shouldDouble = false;
    
    // Loop from right to left
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i));
      
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    
    return sum % 10 === 0;
  };
  
  /**
   * Validate card expiry date
   * @param {string} expiryDate - MM/YY format
   * @returns {boolean} - True if valid and not expired
   */
  export const validateCardExpiry = (expiryDate) => {
    const pattern = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!pattern.test(expiryDate)) {
      return false;
    }
    
    const [month, year] = expiryDate.split('/');
    const expiry = new Date(2000 + parseInt(year), parseInt(month));
    const today = new Date();
    
    // Set to beginning of month for comparison
    today.setDate(1);
    today.setHours(0, 0, 0, 0);
    
    return expiry >= today;
  };
  
  /**
   * Generate payment receipt data
   * @param {object} paymentData - Payment response data
   * @returns {object} - Formatted receipt data
   */
  export const generateReceiptData = (paymentData) => {
    return {
      transactionId: paymentData.transaction_id,
      bookingId: paymentData.booking_id,
      paymentDate: new Date().toISOString(),
      amountPaid: paymentData.amount_paid,
      paymentMethod: getPaymentMethodName(paymentData.payment_method),
      isDeposit: paymentData.is_deposit,
      remainingAmount: paymentData.remaining_amount || 0,
      total: paymentData.total || paymentData.amount_paid,
      customerName: `${paymentData.first_name} ${paymentData.last_name}`
    };
  };
  
  /**
   * Get readable payment method name
   * @param {string} methodCode - Payment method code
   * @returns {string} - Human-readable method name
   */
  export const getPaymentMethodName = (methodCode) => {
    const methods = {
      'credit_card': 'Credit Card',
      'paypal': 'PayPal',
      'bank_transfer': 'Bank Transfer'
    };
    
    return methods[methodCode] || methodCode;
  };