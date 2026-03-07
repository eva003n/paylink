declare global {
    namespace uuid62 {
        interface uuid62 {
            encode(id: string)
            decode(id: string)
        }
    }
}