//
//  SearchBar.swift
//  eventU
//
//  Created by Alexandra Brown on 7/1/21.
//

import SwiftUI
import Alamofire

struct SearchBar: View {
    @EnvironmentObject var modelData: ModelData
    @Binding var searchEvents: [Event]
    //@Binding var noResult: Bool
    @State private var searchText: String = ""
    @State private var showCancelButton: Bool = false

    var body: some View {
        VStack {
            // Search view
            HStack {
                HStack {
                    Image(systemName: "magnifyingglass")

                    TextField("Search...", text: $searchText, onEditingChanged: { isEditing in
                        self.showCancelButton = true
                    }, onCommit: {
                        searchEvents = []
                        searchAPI()
                        print("onCommit")
                    }).foregroundColor(.primary)

                    Button(action: {
                        self.searchText = ""
                    }) {
                        Image(systemName: "xmark.circle.fill").opacity(searchText == "" ? 0 : 1)
                    }
                }
                .padding(EdgeInsets(top: 8, leading: 6, bottom: 8, trailing: 6))
                .foregroundColor(.secondary)
                .background(Color(.secondarySystemBackground))
                .cornerRadius(10.0)

                if showCancelButton  {
                    Button("Cancel") {
                            UIApplication.shared.endEditing(true) // this must be placed before the other commands here
                            self.searchText = ""
                            searchEvents = []
                            self.showCancelButton = false
                    }
                    .foregroundColor(Color(.systemBlue))
                }
            }
            .padding(.horizontal)
            .navigationBarHidden(true)
        }
        .frame(height: 40)
    }
    
    struct Search: Encodable {
        var title: String
    }
    func searchAPI() {
        let search = Search.init(title: searchText)
        AF.request("https://event-u.herokuapp.com/api/events/search",
                    method: .post,
                    parameters: search,
                    encoder: JSONParameterEncoder.default).responseJSON { (data) in
                        debugPrint(data)
                        if data.response?.statusCode == 200 {
                            let JSON = data.value as! NSArray
                            if JSON.count == 0 {
                                searchEvents.append(Event.default)
                                return
                            }
                            for event in JSON {
                                let eventDic = event as! NSDictionary
                                let curEvent = modelData.events.first(where: {$0.objId == eventDic["_id"] as! String})
                                searchEvents.append(curEvent!)
                            }
                        }
                }
    }


}



/*struct SearchBar_Previews: PreviewProvider {
    @Binding var search: String = "Hello"
    static var previews: some View {
        SearchBar(searchText: $search)
    }
}*/

extension UIApplication {
    func endEditing(_ force: Bool) {
        self.windows
            .filter{$0.isKeyWindow}
            .first?
            .endEditing(force)
    }
}

struct ResignKeyboardOnDragGesture: ViewModifier {
    var gesture = DragGesture().onChanged{_ in
        UIApplication.shared.endEditing(true)
    }
    func body(content: Content) -> some View {
        content.gesture(gesture)
    }
}

extension View {
    func resignKeyboardOnDragGesture() -> some View {
        return modifier(ResignKeyboardOnDragGesture())
    }
}
