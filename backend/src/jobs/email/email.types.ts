export type EmailData = {
    to: string,
    subject: string,
    templateId: string,
    variables: Record<string, string>
    userId: string
}