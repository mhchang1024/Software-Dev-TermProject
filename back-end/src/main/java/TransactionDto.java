import org.bson.Document;

//for our payment info
class TransactionDto{
    String to;
    String from;
    Double amount;
    String type;
    String description;

    public TransactionDto(String to, String from, Double amount, String type, String description) {
        this.to = to;
        this.from = from;
        this.amount = amount;
        this.type = type;
        this.description = description;
    }

    public static TransactionDto fromDocument(Document document){

        return new TransactionDto(document.get("to").toString(),
                document.get("from").toString(),
                Double.parseDouble(document.get("amount").toString()),
                document.get("type").toString(),
                document.get("description").toString());
    }
}