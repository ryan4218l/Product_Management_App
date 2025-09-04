import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Checkbox,
} from "@mui/material";
import { ArrowBack, LocalShipping, Payment, CheckCircle, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useForm, Controller } from "react-hook-form";

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

const steps = ["Shipping", "Payment", "Review"];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null);

  const {
    register: registerShipping,
    handleSubmit: handleShippingSubmit,
    formState: { errors: shippingErrors },
    control: shippingControl,
  } = useForm<ShippingFormData>();
  const {
    register: registerPayment,
    handleSubmit: handlePaymentSubmit,
    formState: { errors: paymentErrors },
    control: paymentControl,
  } = useForm<PaymentFormData>();

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data);
    handleNext();
  };

  const onPaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data);
    handleNext();
  };

  const handlePlaceOrder = () => {
    // Simulate order processing
    const newOrderNumber = `ORD-${Date.now()}`;
    setOrderNumber(newOrderNumber);
    setOrderSuccess(true);
    clearCart();
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your cart is empty. Please add items to your cart before checkout.
        </Alert>
        <Button variant="contained" startIcon={<ArrowBack />} onClick={() => navigate("/products")}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  if (orderSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom color="success.main">
            Order Confirmed!
          </Typography>
          <Typography variant="h6" gutterBottom>
            Thank you for your purchase
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Your order number is: <strong>{orderNumber}</strong>
          </Typography>
          <Typography variant="body2" sx={{ mb: 4 }}>
            We've sent a confirmation email with your order details. You will receive another email when your order has shipped.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button variant="contained" onClick={() => navigate("/products")}>
              Continue Shopping
            </Button>
            <Button variant="outlined" onClick={() => navigate("/profile")}>
              View Order History
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Grid container spacing={4}>
        {/* Checkout Form */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            {activeStep === 0 && (
              <Box component="form" onSubmit={handleShippingSubmit(onShippingSubmit)}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
                  Shipping Information
                </Typography>

                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="First Name"
                      defaultValue={""}
                      {...registerShipping("firstName", { required: "First name is required" })}
                      error={!!shippingErrors.firstName}
                      helperText={shippingErrors.firstName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      defaultValue={""}
                      {...registerShipping("lastName", { required: "Last name is required" })}
                      error={!!shippingErrors.lastName}
                      helperText={shippingErrors.lastName?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Email"
                      type="email"
                      defaultValue={user?.email || ""}
                      {...registerShipping("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^\S+@\S+$/i,
                          message: "Invalid email address",
                        },
                      })}
                      error={!!shippingErrors.email}
                      helperText={shippingErrors.email?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Phone"
                      {...registerShipping("phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^(?:\+65\s?)?[3689]\d{7}$/,
                          message: "Invalid Singapore phone number",
                        },
                      })}
                      error={!!shippingErrors.phone}
                      helperText={shippingErrors.phone?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12 }}>
                    <TextField
                      fullWidth
                      label="Address"
                      {...registerShipping("address", { required: "Address is required" })}
                      error={!!shippingErrors.address}
                      helperText={shippingErrors.address?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField fullWidth label="City" {...registerShipping("city", { required: "City is required" })} error={!!shippingErrors.city} helperText={shippingErrors.city?.message} />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="State/Province"
                      {...registerShipping("state", { required: "State is required" })}
                      error={!!shippingErrors.state}
                      helperText={shippingErrors.state?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="ZIP/Postal Code"
                      {...registerShipping("zipCode", { required: "ZIP code is required" })}
                      error={!!shippingErrors.zipCode}
                      helperText={shippingErrors.zipCode?.message}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Country"
                      defaultValue="United States"
                      {...registerShipping("country", { required: "Country is required" })}
                      error={!!shippingErrors.country}
                      helperText={shippingErrors.country?.message}
                    />
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
                  <Button type="submit" variant="contained">
                    Continue to Payment
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 1 && (
              <Box component="form" onSubmit={handlePaymentSubmit(onPaymentSubmit)}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
                  Payment Method
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <FormLabel component="legend">Select Payment Method</FormLabel>
                  <RadioGroup value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                    <FormControlLabel value="credit-card" control={<Radio />} label="Credit/Debit Card" />
                    <FormControlLabel value="paypal" control={<Radio />} label="PayPal" />
                    <FormControlLabel value="bank-transfer" control={<Radio />} label="Bank Transfer" />
                  </RadioGroup>
                </FormControl>

                {paymentMethod === "credit-card" && (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        {...registerPayment("cardNumber", {
                          required: "Card number is required",
                          pattern: {
                            value: /^[0-9]{16}$/,
                            message: "Invalid card number",
                          },
                        })}
                        error={!!paymentErrors.cardNumber}
                        helperText={paymentErrors.cardNumber?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <TextField
                        fullWidth
                        label="Name on Card"
                        {...registerPayment("cardName", { required: "Name on card is required" })}
                        error={!!paymentErrors.cardName}
                        helperText={paymentErrors.cardName?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="Expiry Date"
                        placeholder="MM/YY"
                        {...registerPayment("expiryDate", {
                          required: "Expiry date is required",
                          pattern: {
                            value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                            message: "Invalid expiry date (MM/YY)",
                          },
                        })}
                        error={!!paymentErrors.expiryDate}
                        helperText={paymentErrors.expiryDate?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                        fullWidth
                        label="CVV"
                        placeholder="123"
                        {...registerPayment("cvv", {
                          required: "CVV is required",
                          pattern: {
                            value: /^[0-9]{3,4}$/,
                            message: "Invalid CVV",
                          },
                        })}
                        error={!!paymentErrors.cvv}
                        helperText={paymentErrors.cvv?.message}
                      />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                      <FormControlLabel
                        control={<Controller name="saveCard" control={paymentControl} defaultValue={false} render={({ field }) => <Checkbox {...field} />} />}
                        label="Save card for future purchases"
                      />
                    </Grid>
                  </Grid>
                )}

                {paymentMethod === "paypal" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    You will be redirected to PayPal to complete your payment.
                  </Alert>
                )}

                {paymentMethod === "bank-transfer" && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Bank transfer details will be provided after order confirmation.
                  </Alert>
                )}

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  <Button onClick={handleBack} startIcon={<ArrowBack />}>
                    Back
                  </Button>
                  <Button type="submit" variant="contained">
                    Continue to Review
                  </Button>
                </Box>
              </Box>
            )}

            {activeStep === 2 && (
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", mb: 3 }}>
                  Order Review
                </Typography>

                {/* Shipping Information Review */}
                {shippingData && (
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                      Shipping Address
                    </Typography>
                    <Typography variant="body2">
                      {shippingData.firstName} {shippingData.lastName}
                      <br />
                      {shippingData.address}
                      <br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                      <br />
                      {shippingData.country}
                      <br />
                      {shippingData.email}
                      <br />
                      {shippingData.phone}
                    </Typography>
                    <Button size="small" startIcon={<Edit />} sx={{ mt: 1 }} onClick={() => setActiveStep(0)}>
                      Edit
                    </Button>
                  </Box>
                )}

                {/* Payment Information Review */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Payment Method
                  </Typography>
                  {paymentMethod === "credit-card" && paymentData ? (
                    <>
                      <Typography variant="body2">
                        Credit Card ending in •••• {paymentData.cardNumber?.slice(-4)}
                        <br />
                        {paymentData.cardName}
                        <br />
                        Expires: {paymentData.expiryDate}
                      </Typography>
                    </>
                  ) : paymentMethod === "paypal" ? (
                    <Typography variant="body2">PayPal</Typography>
                  ) : (
                    <Typography variant="body2">Bank Transfer</Typography>
                  )}
                  <Button size="small" startIcon={<Edit />} sx={{ mt: 1 }} onClick={() => setActiveStep(1)}>
                    Edit
                  </Button>
                </Box>

                {/* Order Items Review */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: "bold" }}>
                    Order Items
                  </Typography>
                  {cartItems.map((item) => (
                    <Box key={item.product.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            backgroundImage: `url(${item.product.imageUrl || "https://via.placeholder.com/40x40"})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 1,
                            mr: 2,
                          }}
                        />
                        <Box>
                          <Typography variant="body2">{item.product.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Qty: {item.quantity}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="body2">${(item.product.price * item.quantity).toFixed(2)}</Typography>
                    </Box>
                  ))}
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
                  <Button onClick={handleBack} startIcon={<ArrowBack />}>
                    Back
                  </Button>
                  <Button variant="contained" onClick={handlePlaceOrder} size="large">
                    Place Order
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={2} sx={{ p: 3, position: "sticky", top: 20 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Order Summary
            </Typography>

            {/* Order Items */}
            {cartItems.map((item) => (
              <Box key={item.product.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      backgroundImage: `url(${item.product.imageUrl || "https://via.placeholder.com/40x40"})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      borderRadius: 1,
                      mr: 2,
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body2" noWrap>
                      {item.product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2">${(item.product.price * item.quantity).toFixed(2)}</Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2 }} />

            {/* Pricing */}
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Subtotal:</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2">Shipping:</Typography>
                <Typography variant="body2">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</Typography>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="body2">Tax:</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  Total:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  ${total.toFixed(2)}
                </Typography>
              </Box>

              {subtotal < 50 && (
                <Alert severity="info" sx={{ mb: 2 }}>
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </Alert>
              )}
            </Box>

            {/* Trust Badges */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 1 }}>
                <LocalShipping color="action" />
                <Payment color="action" />
              </Box>
              <Typography variant="caption" color="text.secondary">
                Secure checkout • Free returns • 24/7 support
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Checkout;
