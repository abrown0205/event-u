//
//  login.swift
//  eventU
//
//  Created by Alexandra Brown on 6/28/21.
//

import SwiftUI
import Alamofire
import JWTDecode

struct login: View {
    @EnvironmentObject var modelData: ModelData
    
    @State private var username: String = ""
    @State private var password: String = ""
    
    @State private var active: Bool = false
    @State private var needsActivation: Bool = false
    @State private var authenticationFail: Bool = false
    @State private var incorrectPassword: Bool = false
    @State private var authenticationSucceed: Bool = false
    
    let def = UserDefaults.standard
    
    
    var body: some View {
        NavigationView {
            VStack {
                Text("Welcome Back!")
                    .font(.title)
                    .bold()
                Form {
                    UsernameField(username: $username)
                    PasswordField(password: $password)
                    
                    if authenticationFail {
                        Text("Error logging in. Please try again.")
                            .foregroundColor(.red)
                    }
                    if incorrectPassword {
                        Text("Incorrect password or username. Please try again.")
                            .foregroundColor(.red)
                    }

                    Button(action: {
                        callAPI(un: self.username, pw: self.password)
                        },
                           label: {
                            Text("Sign In")
                                .padding()
                                .frame(minWidth: 0, maxWidth: .infinity)
                                .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                                .foregroundColor(.white)
                                .cornerRadius(40)
                        })
                        .padding(.vertical, 20)
                    .fullScreenCover(isPresented: $active, content: {
                            tabs(tabNum: 0)
                                .environmentObject(ModelData())
                    })
                    .fullScreenCover(isPresented: $needsActivation, content: {
                            Verification()
                                .environmentObject(ModelData())
                    })
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                
                HStack{
                    NavigationLink(destination: ResetPassword()){
                        Text("Forgot Password?")
                            .foregroundColor(Color.init(red: 151/255, green: 123/255, blue: 115/255, opacity: 1))
                    }
                    .navigationBarHidden(true)
                }
                HStack{
                    Text("Don't have an account?")
                    NavigationLink(destination: signup().navigationBarHidden(true)){
                        Text("Sign Up!")
                            .foregroundColor(Color.init(red: 151/255, green: 123/255, blue: 115/255, opacity: 1))
                    }
                    .navigationBarHidden(true)
                }
            }
            .navigationBarHidden(true)
        }
    }
    struct Login: Encodable {
        var username: String
        var password: String
    }
    
    func callAPI(un: String, pw: String) {
        let log = Login(username: self.username, password: self.password)
            AF.request("https://event-u.herokuapp.com/api/users/login",
                       method: .post,
                       parameters: log,
                       encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                        print(response)
                        if response.response?.statusCode == 400 {
                            incorrectPassword = true
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
                                     "active": jwt.claim(name: "active").boolean!,
                                     "activationCode": jwt.claim(name: "activationCode").integer!]
                                def.set(curUser, forKey: "user")
                                def.set(1, forKey: "loggedIn")
                                self.authenticationSucceed = true
                                self.authenticationFail = false
                                if curUser["active"] as! Bool == false {
                                    self.needsActivation = true
                                } else {
                                    self.active = true
                                }
                                updateStoredPassword(account: self.username, password:  self.password)
                                
                            } catch {
                                self.authenticationFail = true
                                self.authenticationSucceed = false
                            }

                        } else {
                            self.authenticationFail = true
                            self.authenticationSucceed = false
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


struct login_Previews: PreviewProvider {
    static var previews: some View {
        login()
            .environmentObject(ModelData())
            
    }
}

struct UsernameField: View {
    @Binding var username: String
    var body: some View {
        TextField(
            "Username",
            text: $username)
            .disableAutocorrection(true)
            .autocapitalization(.none)
    }
}

struct PasswordField: View {
    @Binding var password: String
    var body: some View {
        SecureField(
            "Password",
            text: $password)
            .disableAutocorrection(true)
            .autocapitalization(.none)
        
    }
}
