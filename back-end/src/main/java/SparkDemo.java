import static spark.Spark.*;
import com.google.gson.Gson;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.ArrayList;
import java.util.List;

public class SparkDemo {

  public static void main(String[] args) {
    port(1234);
    MongoClient mongoClient = new MongoClient("localhost", 27017);
    // get ref to database
    MongoDatabase db = mongoClient.getDatabase("UsersDatabase");
    // get ref to collection
    MongoCollection<Document> usersCollection = db.getCollection("FinalUsersCollection");
    MongoCollection<Document> allTransactions = db.getCollection("FinalTransactionsCollection");

    Gson gson = new Gson();

    post("/logIn", (req, res) -> {

      String body = req.body();
      LoginDto loginDto = gson.fromJson(body, LoginDto.class);
      System.out.println(body);
      if (validUser(usersCollection, loginDto.username)) {
        if (validPass(usersCollection,loginDto)) {

          System.out.println("All good");
          return gson.toJson(new LoginResponseDto(true, null));

        } else {
          System.out.println("Invalid password");
          return gson.toJson(new LoginResponseDto(false, "Invalid username/password"));

        }
      } else {
        return gson.toJson(new LoginResponseDto(false, "Username does not exist"));
      }
     /*
          this is a doc model for our  user collection
          {
            "username": "test1",
            "password" : "test"
          }
    */
    });

    post("/signup", (req,res) -> {
      String body = req.body();
      LoginDto loginDto = gson.fromJson(body, LoginDto.class);
      if (validUser(usersCollection, loginDto.username)) {
        return gson.toJson(new LoginResponseDto(true, "Username already exist"));
      }else{
       String PATTERN = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$";
        Pattern pattern = Pattern.compile(PATTERN);
        Matcher matcher = pattern.matcher(loginDto.password);
        if( !matcher.matches()){
          return gson.toJson(new LoginResponseDto(false, "Invalid Password: Minimum 8 characters, at least one letter and one number"));
        }

        // Creates new Document and adds in new user information into mongo collection
        Document document = new Document()
                .append("username", loginDto.username)
                .append("password", loginDto.password);
        usersCollection.insertOne(document);
        return gson.toJson(new LoginResponseDto(false, "User Created"));
      }

    });

    post("/makePayment", (req, res) -> {
      try{

        String body = req.body();
        TransactionDto transaction = gson.fromJson(body, TransactionDto.class);

        //if both users are valid, then payment can be made
        if (validUser(usersCollection,transaction.from)&& validUser(usersCollection,transaction.to) ) {
            if (transaction.to == ""
                    || transaction.from == ""
                    ||transaction.amount == null
                    ||transaction.type == null
                    ||transaction.description == null ){
              return gson.toJson(new TransactionDtoResponse(false, "Payment Unsuccessful: A field was left empty"));
            }
            //making a document to store the transaction info
            Document document = new Document()
                    .append("to", transaction.to)
                    .append("from", transaction.from)
                    .append("amount", transaction.amount)
                    .append("type", transaction.type)
                    .append("description", transaction.description);
            allTransactions.insertOne(document);
            return gson.toJson(new TransactionDtoResponse(true, "Payment Successful"));

        } else {

          //Checking if our sender and receiver are registered users
          if (!validUser(usersCollection,transaction.from)){
            return gson.toJson(new TransactionDtoResponse(false, "Payment Unsuccessful, Sender is not a user!!"));
          }else if (!validUser(usersCollection,transaction.to)){
            return gson.toJson(new TransactionDtoResponse(false, "Payment Unsuccessful, Receiver is not a user!!"));
          }else{
            return gson.toJson(new TransactionDtoResponse(false, "Payment Unsuccessful"));
          }

        }
      }catch (Exception e){
        System.out.println(e);
      }
      return null;
      /*
       this is a doc model for our  transaction collection

          {
            "to": "test1",
            "from" : "Brian",
            "amount": "100",
            "type" : "cash",
            "description": "test"
          }
      */
    });

    post("/feed", (req, res) -> {
      MongoCursor<Document> cursor = allTransactions .find().iterator();
      List<TransactionDto> allPayments = new ArrayList();
      try{
        while(cursor.hasNext()){
          Document document = cursor.next();
          allPayments.add(new TransactionDto(document.get("to").toString(),
                  document.get("from").toString(),
                  Double.parseDouble(document.get("amount").toString()),
                  document.get("type").toString(),
                  document.get("description").toString()));
        }
      }finally{
        cursor.close();
      }
      //System.out.println(gson.toJson(allPayments));
      return gson.toJson(allPayments);

    });
  }

  public static boolean validUser(MongoCollection<Document> a, String b){
    MongoCursor<Document> cursor = a.find().iterator();
    try{
      //iterates  validates if there is an existing username
      while(cursor.hasNext()){
        Document doc = cursor.next();
        //System.out.println(doc);
        //System.out.println(doc);
        if(doc.getString("username").equals(b)){
          return true;
        }
      }
    }catch (Exception e){
      System.out.println("From User: "+e);
    }finally{
      cursor.close();
    }

    return false;
  }
  public static boolean validPass(MongoCollection<Document> a, LoginDto b){
    MongoCursor<Document> cursor = a.find().iterator();
    try{
      //iterates through collection and validates both password and username
      while(cursor.hasNext()){
        Document doc = cursor.next();
        if(doc.getString("password").equals(b.password) && doc.getString("username").equals(b.username)){
          return true;
        }
      }
    }catch (Exception e){
      System.out.println("From pass: "+e);
    }
    finally{
      cursor.close();
    }
    return false;

  }

}