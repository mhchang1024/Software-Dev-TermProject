class TransactionDtoResponse{
    Boolean isPaymentMade;
    String message;

    public TransactionDtoResponse(Boolean isPaymentMade, String message) {
        this.isPaymentMade = isPaymentMade;
        this.message = message;
    }
}