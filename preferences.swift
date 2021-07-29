//
//  preferences.swift
//  eventU
//
//  Created by Alexandra Brown on 7/15/21.
//

import SwiftUI
import Alamofire

struct preferences: View {
    @EnvironmentObject var modelData: ModelData
    @ObservedObject var cats = Categories()
    @State private var showCatSheet: Bool = false
    @State private var active: Bool = false
    
    var body: some View {
        //@State var curUser: User
        
        VStack {
            Text("Select Your Preferences")
                .font(.title)
                .bold()
            Divider()
            
            Button(action: {
                self.showCatSheet.toggle()
            }) {
                HStack {
                    Text("Choose Categories")
                        .foregroundColor(Color.black)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .foregroundColor(Color(UIColor.systemGray4))
                        .font(Font.body.weight(.medium))
                }
            }
            .sheet(isPresented: $showCatSheet) {
                MultiSelect(profile: $modelData.user)
                    .environmentObject(modelData)
            }
            
            /*Toggle(isOn: .constant(false), label: {
                Text("Push Notifications")
            })*/
            Spacer()
            Button(action: {
                self.active = true
                callAPI() 
                
                },
                   label: {
                    Text("Continue")
                        .padding()
                        .frame(minWidth: 0, maxWidth: .infinity)
                        .background(Color.init(red: 73/255, green: 58/255, blue: 80/255, opacity: 1))
                        .foregroundColor(.white)
                        .cornerRadius(40)
                })
            Spacer()
        }
        .padding()
        .fullScreenCover(isPresented: $active, content: {
            tabs(tabNum: 0)
                    .environmentObject(ModelData())
        })
    }
    
    struct Preference: Encodable {
        var username: String
        var preferences: [String]
    }
    
    func callAPI() {
        var prefArr: [String] = []
        for cat in modelData.user.preferences {
            prefArr.append(cat.rawValue)
        }
        var userDict = UserDefaults.standard.dictionary(forKey: "user")
        userDict!["preferences"] = prefArr
        UserDefaults.standard.setValue(userDict, forKey: "user")
        let pref = Preference.init(username: modelData.user.username, preferences: prefArr)
        AF.request("https://event-u.herokuapp.com/api/users/preferences",
                    method: .post,
                    parameters: pref,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                        if response.response?.statusCode == 200 {
                            self.active = true
                        }
                }
    }
}

struct preferences_Previews: PreviewProvider {
    static var previews: some View {
        preferences()
            .environmentObject(ModelData())
    }
}
