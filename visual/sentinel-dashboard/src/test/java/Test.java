import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @Description:
 * @Author: Gary
 * @DateTime:2022/11/13 23:19
 * @Version: V2.0
 */
public class Test {

    public static void main(String[] args) {
        new Test().mains();
    }

    public void mains() {
        List<User> userList = new ArrayList<>();
        userList.add(new User("1","test1","1"));
        userList.add(new User("2","test2","2"));
        userList.add(new User("3","test3","2"));
        userList.add(new User("4","test4","2"));
        userList.add(new User("5","test5","1"));

        Map<String,List<User>> listMap = new HashMap<>();
        for (User user : userList) {
            List<User> users = listMap.get(user.getUserType());
            if (users == null || users.isEmpty()){
                users = new ArrayList<>();
            }
            users.add(user);
            listMap.put(user.getUserType(),users);
        }

        Map<String, User> collect = userList.stream().collect(Collectors.toMap(User::getId, Function.identity()));
        Map<User, String> collect1 = userList.stream().collect(Collectors.toMap(Function.identity(), User::getId));

        Map<String, List<User>> collect2 = userList.stream().collect(Collectors.groupingBy(User::getUserType));

        Set<String> strings = collect2.keySet();


        collect.forEach((k,v)->{
            System.out.println(k+"k");
            System.out.println(v.toString());
        });

        userList.forEach(user -> {

        });



        System.out.println("");


    }

    class User{

        public User(String id, String username, String userType) {
            this.id = id;
            this.username = username;
            this.userType = userType;
        }

        private String id;

        private String username;

        private String userType;


        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getUserType() {
            return userType;
        }

        public void setUserType(String userType) {
            this.userType = userType;
        }

        @Override
        public String toString() {
            return "User{" +
                    "id='" + id + '\'' +
                    ", username='" + username + '\'' +
                    ", userType='" + userType + '\'' +
                    '}';
        }
    }
}
