//
//  CatRow.swift
//  eventU
//
//  Created by Alexandra Brown on 7/11/21.
//

import SwiftUI

struct CatRow: View {
    @EnvironmentObject var modelData: ModelData
    @State var catName: String
    @State var items: [Event]
    @State var fromSearch: Bool
    @State var searchEvents: [Event]

    var body: some View {
        VStack(alignment: .leading) {
            HStack {
                Text(catName)
                    .font(.title2)
                    .padding(.leading, 15)
                    .padding(.top, 5)
                Image(systemName: Category.init(rawValue: catName)!.image)
                    .padding()
            }

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(alignment: .top, spacing: 0) {
                    if items.count == 0 {
                        Text("No events for this category.")
                            .padding()
                    } else {
                        ForEach(items) { event in
                            if fromSearch {
                                if searchEvents.contains(event) {
                                    NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                        CatItem(event: event)
                                    }
                                }
                            } else {
                                NavigationLink(destination: EventHost(event: event, fromProfile: false).environmentObject(modelData)) {
                                    CatItem(event: event)
                                }
                            }
                        }
                    }
                }
            }
            .frame(height: 185)
        }
        .onAppear {
            if !fromSearch {
                items.removeAll(where: {$0.startTime < Date()})
            }
        }
    }
}

/*struct CatRow_Previews: PreviewProvider {
    
    static var previews: some View {
        CatRow(catName: Event.default.category.rawValue, items: [Event.default], fromSearch: false, searchEvents: [])
                .environmentObject(ModelData())
    }
}*/
