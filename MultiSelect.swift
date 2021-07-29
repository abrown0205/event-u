//
//  MultiSelect.swift
//  eventU
//
//  Created by Alexandra Brown on 7/5/21.
//

import SwiftUI

struct MultiSelect: View {
    @Binding var profile: User
    @State var selections: [Category] = []
    @EnvironmentObject var modelData: ModelData
    /*@ObservedObject var cats: Categories
    
    init(_ cats: Categories) {
        self.cats = cats
    }*/
    
    @Environment(\.presentationMode) var presentationMode

    var body: some View {
        NavigationView {
            List {
                Section(header: Text("Category")) {
                    ForEach(Category.allCases, id: \.self) { item in
                        MultipleSelectionRow(title: item.rawValue, image: item.image, isSelected: self.selections.contains(item)) {
                            if self.selections.contains(item) {
                                self.selections.removeAll(where: { $0 == item })
                            }
                            else {
                                self.selections.append(item)
                            }
                        }
                    }
                }
            }
            .onAppear(perform: {self.selections = profile.preferences })
            .listStyle(GroupedListStyle())
            .navigationBarTitle("Categories", displayMode: .inline)
            .navigationBarItems(trailing:
                                    Button(action: {
                                        profile.preferences = self.selections
                                        self.presentationMode.wrappedValue.dismiss()
                                    }) {
                                        Text("OK")
                                            .foregroundColor(.black)
                                    }
            )
        }
    }
}

struct MultipleSelectionRow: View {
    var title: String
    var image: String
    var isSelected: Bool
    var action: () -> Void

    var body: some View {
        Button(action: self.action) {
            HStack {
                Image(systemName: self.image)
                    .foregroundColor(.yellow)
                    
                Text(self.title)
                    .foregroundColor(.black)
                if self.isSelected {
                    Spacer()
                    Image(systemName: "checkmark")
                        .foregroundColor(.black)
                }
            }
        }
    }
}

struct MultiSelect_Previews: PreviewProvider {
    static var previews: some View {
        MultiSelect(profile: .constant(.default))
            .environmentObject(ModelData())
    }
}
