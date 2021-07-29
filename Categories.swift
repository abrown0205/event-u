//
//  Categories.swift
//  eventU
//
//  Created by Alexandra Brown on 7/6/21.
//

import SwiftUI
import Combine

enum Category: String, CaseIterable, Codable {
    case sports = "Sports"
    case music = "Music"
    case studying = "Studying"
    case artsAndCulture = "Arts & Culture"
    case shopping = "Shopping"
    case science = "Science"
    case social = "Social"
    
    var id: Category {
        self
    }
    
    var image: String {
        switch self {
        case .sports: return "sportscourt"
        case .music: return "music.note"
        case .studying: return "books.vertical"
        case .artsAndCulture: return "paintpalette"
        case .shopping: return "cart"
        case .science: return "leaf"
        case .social: return "person.3"
        }
    }
 
}

class Categories: ObservableObject {
    @Published var cats = [Category]()
}

