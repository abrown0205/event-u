//
//  Verification.swift
//  eventU
//
//  Created by Alexandra Brown on 7/20/21.
//


import SwiftUI
import Alamofire
import JWTDecode

struct Verification: View {
    @EnvironmentObject var modelData: ModelData
    
    @State private var activationCode: String = ""
    @State private var active: Bool = false
    @State private var emailFail: Bool = false
    @State private var emailSent: Bool = false
    @State private var activationFail: Bool = false
    @State private var activationSucceed: Bool = false
    
    let def = UserDefaults.standard
    
    
    var body: some View {
            VStack {
                Text("Activation Required")
                    .font(.title)
                    .bold()
                Form {
                    Text("Please enter the activation code sent to your email.")
                    TextField("Activation Code", text: $activationCode)
                        .disableAutocorrection(true)
                        .autocapitalization(.none)
                    
                    Button(action: {
                        callAPI()
                        },
                           label: {
                            Text("Activate")
                                .padding()
                                .frame(minWidth: 0, maxWidth: .infinity)
                                .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                                .foregroundColor(.white)
                                .cornerRadius(40)
                        })
                        .padding(.vertical, 20)
                    .fullScreenCover(isPresented: $active, content: {
                            preferences()
                                .environmentObject(modelData)
                    })
                    if activationFail {
                        Text("There was an error activating your account. Please try again.")
                            .foregroundColor(.red)
                    }
                    if emailFail {
                        Text("Unable to send welcome email.")
                            .foregroundColor(.red)
                    }
                    if emailSent {
                        Text("Email sent!")
                            .bold()
                    }
                }
                .textFieldStyle(RoundedBorderTextFieldStyle())
                HStack{
                    Button(action: {emailAPI()}, label: {
                        Text("Click Here")
                            .foregroundColor(Color.init(red: 151/255, green: 123/255, blue: 115/255, opacity: 1))
                        
                    })
                    Text("to send resend the welcome email.")
                    .navigationBarHidden(true)
                }
            }
            .onAppear {
                setUser()
            }
    }
    
    struct Activate: Encodable {
        var username: String
        var active: Bool
    }
    func callAPI() {
        if Int(activationCode) == nil {
            self.activationFail = true
            return
        }
        if Int(activationCode) != modelData.user.activationCode {
            self.activationFail = true
            return
        }
        let act = Activate.init(username: modelData.user.username, active: true)
        AF.request("https://event-u.herokuapp.com/api/users/activate",
                    method: .post,
                    parameters: act,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode == 200 {
                            self.activationSucceed = true
                            self.activationFail = false
                            self.active = true
                        } else {
                            self.activationFail = true
                            self.activationSucceed = false
                        }
                }
    }
    func setUser(){
        let userDict = UserDefaults.standard.dictionary(forKey: "user")
        var cats: [Category] = []
        for pref in userDict!["preferences"] as! [String] {
            cats.append(Category.init(rawValue: pref)!)
        }
        let cur = User.init(id: 0, objId: userDict!["objId"] as! String, username: userDict!["username"] as! String, firstName: userDict!["firstName"] as! String, lastName: userDict!["lastName"] as! String, email: userDict!["email"] as! String, preferences: cats, likedEvents: userDict!["likedEvents"] as! [String], attendedEvents: userDict!["attendedEvents"] as! [String], activationCode: userDict!["activationCode"] as! Int)
        modelData.user = cur
    }
    
    struct Email: Encodable {
        var username: String
        var firstName: String
        var lastName: String
        var email: String
        var activationCode: Int
    }
    func emailAPI() {
        let user = modelData.user
        let mail = Email.init(username: user.username, firstName: user.firstName, lastName: user.lastName, email: user.email, activationCode: user.activationCode)
        AF.request("https://event-u.herokuapp.com/api/users/sendWelcomeEmail",
                   method: .post,
                   parameters: mail,
                   encoder: JSONParameterEncoder.default).validate().responseJSON { response in
                    if response.response?.statusCode == 200 {
                        self.emailSent = true
                    } else {
                        self.emailFail = true
                    }
                }
    }
    
}


struct Verification_Previews: PreviewProvider {
    static var previews: some View {
        Verification()
            .environmentObject(ModelData())
            
    }
}

