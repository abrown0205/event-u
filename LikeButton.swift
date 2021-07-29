//
//  LikeButton.swift
//  eventU
//
//  Created by Alexandra Brown on 7/18/21.
//

import SwiftUI
import Alamofire

struct LikeButton: View {
    @EnvironmentObject var modelData: ModelData
    @State var event: Event
    @Binding var isSet: Bool
    
    var body: some View {
        HStack {
            let ind = modelData.events.firstIndex(where: { $0.objId == event.objId })
            Button(action: {
                isSet.toggle()
                
                if isSet {
                    modelData.events[ind!].likes += 1
                    modelData.user.likedEvents.append(event.objId)
                } else {
                    modelData.events[ind!].likes -= 1
                    modelData.user.likedEvents.removeAll(where: {$0 == event.objId})
                }
                updateLikes()
                likesAPI()
            }) {
                Image(systemName: isSet ? "heart.fill" : "heart")
                    .foregroundColor(isSet ? Color.red : Color.gray)
            }
            Text("\(modelData.events[ind!].likes)")
        }
    }
    struct UpdateLikes: Encodable {
        var _id: String
        var likes: Int
    }
    func updateLikes() {
        let ind = modelData.events.firstIndex(where: { $0.objId == event.objId })
        let up = UpdateLikes.init(_id: event.objId, likes: modelData.events[ind!].likes)
        AF.request("https://event-u.herokuapp.com/api/events/updateLikes",
                    method: .post,
                    parameters: up,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                }
    }
    struct Likes: Encodable {
        var username: String
        var likedEvents: [String]
    }
    
    func likesAPI() {
        var userDict = UserDefaults.standard.dictionary(forKey: "user")
        userDict!["likedEvents"] = modelData.user.likedEvents
        UserDefaults.standard.setValue(userDict, forKey: "user")
        
        let like = Likes.init(username: modelData.user.username, likedEvents: modelData.user.likedEvents)
        AF.request("https://event-u.herokuapp.com/api/users/likes",
                    method: .post,
                    parameters: like,
                    encoder: JSONParameterEncoder.default).responseJSON { response in
                        debugPrint(response)
                }
    }
     
}

struct LikeButton_Previews: PreviewProvider {
    static var previews: some View {
        LikeButton(event: Event.default, isSet: .constant(true))
    }
}
