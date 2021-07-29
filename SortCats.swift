//
//  SortCats.swift
//  eventU
//
//  Created by Alexandra Brown on 7/8/21.
//

import SwiftUI

struct SortCats: View {
    @EnvironmentObject var modelData: ModelData
    var body: some View {
        List {
            ForEach(Category.allCases, id: \.id) { key in
                if modelData.categories[key.rawValue] != nil {
                    CatRow(catName: key.rawValue, items: modelData.categories[key.rawValue]!, fromSearch: false, searchEvents: [])
                        .environmentObject(modelData)
                } else {
                    CatRow(catName: key.rawValue, items: [], fromSearch: false, searchEvents: [])
                    .environmentObject(modelData)
                }
            }
        }
        .navigationBarHidden(true)
        
    }
}

struct SortCats_Previews: PreviewProvider {
    static var previews: some View {
        SortCats()
            .environmentObject(ModelData())
    }
}
