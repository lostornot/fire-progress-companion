import SwiftUI

struct InsightsView: View {
    @Environment(AppStore.self) var store

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    ForEach(store.insights) { insight in
                        VStack(alignment: .leading, spacing: 8) {
                            Text(insight.kind.rawValue.uppercased())
                                .font(.caption)
                                .foregroundStyle(.secondary)
                                .tracking(2)
                            Text(insight.title)
                                .font(.title3.bold())
                            Text(insight.body)
                                .foregroundStyle(.secondary)
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)
                        .padding()
                        .background(.gray.opacity(0.08))
                        .clipShape(RoundedRectangle(cornerRadius: 16))
                    }
                }
                .padding()
            }
            .navigationTitle(store.t("insights"))
        }
    }
}
