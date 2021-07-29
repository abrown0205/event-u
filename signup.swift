//
//  signup.swift
//  eventU
//
//  Created by Alexandra Brown on 6/29/21.
//

import SwiftUI
import Alamofire
import JWTDecode

struct signup: View {
    @EnvironmentObject var modelData: ModelData
    
    @State private var firstName: String = ""
    @State private var lastName: String = ""
    @State private var email: String = ""
    @State private var username: String = ""
    @State private var password: String = ""
    
    @State private var active: Bool = false
    @State private var userExists: Bool = false
    @State private var emailIssue: Bool = false
    @State private var signupFail: Bool = false
    @State private var signupSuccess: Bool = false
    
    let def = UserDefaults.standard
    
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Welcome to EventU!")
                    .font(.title)
                    .bold()
                Form {
                    TextField(
                        "First Name",
                        text: $firstName)
                        .disableAutocorrection(true)
                    TextField(
                        "Last Name",
                        text: $lastName)
                        .disableAutocorrection(true)
                    TextField(
                        "Email",
                        text: $email)
                        .disableAutocorrection(true)
                        .autocapitalization(.none)
                    TextField(
                        "Username",
                        text: $username)
                        .disableAutocorrection(true)
                        .autocapitalization(.none)
                    SecureField(
                        "Password",
                        text: $password)
                        .disableAutocorrection(true)
                        .autocapitalization(.none)
                    
                    if signupFail {
                        Text("Unable to create new account.")
                            .foregroundColor(.red)
                    }
                    
                    if userExists {
                        Text("Username taken.")
                            .foregroundColor(.red)
                    }
                    if emailIssue {
                        Text("Unable to send welcome email.")
                            .foregroundColor(.red)
                    }
                    
                    Button(action: {
                        registerAPI()
                        },
                           label: {
                            Text("Sign Up")
                                .padding()
                                .frame(minWidth: 0, maxWidth: .infinity)
                                .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                                .foregroundColor(.white)
                                .cornerRadius(40)
                        })
                        .padding(.vertical, 20)
                    .fullScreenCover(isPresented: $active, content: {
                            Verification()
                                .environmentObject(ModelData())
                    })
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                
                HStack{
                    Text("Already have an account?")
                    NavigationLink(destination: login().navigationBarHidden(true)){
                        Text("Sign In!")
                            .foregroundColor(Color.init(red: 151/255, green: 123/255, blue: 115/255, opacity: 1))
                    }
                    .navigationBarHidden(true)
                }
                
            }
            .navigationBarHidden(true)
        }
    }
    struct newUser: Encodable {
        var username: String
        var firstName: String
        var lastName: String
        var email: String
        var password: String
    }
    
    func registerAPI() {
        if self.username == "" || self.firstName == "" || self.lastName == "" || self.email == "" || self.password == "" {
            signupFail = true
            return
        }
        let new = newUser(username: self.username, firstName: self.firstName, lastName: self.lastName, email: self.email, password: self.password)
            AF.request("https://event-u.herokuapp.com/api/users/register",
                       method: .post,
                       parameters: new,
                       encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                        
                         if response.response?.statusCode == 400 {
                             userExists = true
                             return
                         }
                        if response.error == nil {
                            do {
                                let JSON = response.value as! NSDictionary
                                let token = (JSON["accessToken"] as! String)
                                let jwt = try decode(jwt: String(token))
                                
                                let curUser: NSDictionary =
                                    ["id": 0,
                                     "objId": jwt.claim(name: "_id").string!,
                                     "username": jwt.claim(name: "username").string!,
                                     "firstName": jwt.claim(name: "firstName").string!,
                                     "lastName": jwt.claim(name: "lastName").string!,
                                     "email": jwt.claim(name: "email").string!,
                                     "preferences": jwt.claim(name: "preferences").array!,
                                     "likedEvents": jwt.claim(name: "likedEvents").array!,
                                     "attendedEvents": jwt.claim(name: "attendedEvents").array!,
                                     "activationCode": jwt.claim(name: "activationCode").integer!]
                                
                                def.set(curUser, forKey: "user")
                                def.set(1, forKey: "loggedIn")
                                emailAPI()
                                self.signupSuccess = true
                                self.signupFail = false
                                updateStoredPassword(account: self.username, password: self.password)
                                
                            } catch {
                                self.signupFail = true
                                self.signupSuccess = false
                            }
                        } else {
                            self.signupFail = true
                            self.signupSuccess = false
                        }
                    }
    }
    struct Email: Encodable {
        var username: String
        var firstName: String
        var lastName: String
        var email: String
        var activationCode: Int
    }
    func emailAPI() {
        let curUser = def.dictionary(forKey: "user")
        let mail = Email.init(username: self.username, firstName: self.firstName, lastName: self.lastName, email: self.email, activationCode: curUser!["activationCode"] as! Int)
        AF.request("https://event-u.herokuapp.com/api/users/sendWelcomeEmail",
                   method: .post,
                   parameters: mail,
                   encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                    if response.response?.statusCode == 200 {
                        self.active = true
                    } else {
                        self.emailIssue = true
                    }
                }
    }
    
    func updateStoredPassword(account: String, password: String) {
        let kcw = KeychainWrapper()
        do {
            try kcw.storeGenericPasswordFor(
                account: account,
                service: "unlockPassword",
                password: password)
        } catch let error as KeychainWrapperError {
            print("Exception setting password: \(error.message ?? "no message")")
        } catch {
            print("An error occurred setting the password.")
        }
    }
}


struct signup_Previews: PreviewProvider {
    static var previews: some View {
        signup()
            .environmentObject(ModelData())
            
    }
}
