class LoginResponseDto{
    Boolean isLoggedIn;
    String message;

    public LoginResponseDto(Boolean isLoggedIn, String message) {
        this.isLoggedIn = isLoggedIn;
        this.message = message;
    }
}