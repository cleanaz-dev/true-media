// components/admin/email/admin-email-page.tsx
import { EmailManagementData } from "@/lib/actions/get-email-data";

interface AdminEmailPageProps {
  // It's an object containing two arrays, NOT an array itself
  emailData: EmailManagementData; 
}

export function AdminEmailPage({ emailData }: AdminEmailPageProps) {
  const { templates, logs } = emailData;

  return (
    <main className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Email Administration</h1>
      
      {/* ===================== LOGS ===================== */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sent Logs ({logs.length})</h2>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Recipient</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr><td colSpan={4} className="p-4 text-center text-gray-500">No emails sent yet.</td></tr>
              )}
              {logs.map((log) => (
                <tr key={log.id} className="border-b hover:bg-gray-50">
                  <td className="p-4">{log.to}</td>
                  <td className="p-4">{log.subject}</td>
                  <td className="p-4">{log.status}</td>
                  <td className="p-4">{new Date(log.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===================== TEMPLATES ===================== */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Templates ({templates.length})</h2>
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Slug</th>
                <th className="p-4">Name</th>
                <th className="p-4">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {templates.length === 0 && (
                <tr><td colSpan={3} className="p-4 text-center text-gray-500">No templates found.</td></tr>
              )}
              {templates.map((template) => (
                <tr key={template.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-mono text-xs">{template.slug}</td>
                  <td className="p-4">{template.name}</td>
                  <td className="p-4">{new Date(template.updatedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
