export default class EmailHelper {
  public static welcomeEmail(userName: string): string {
    return `
        <!DOCTYPE html>
        <html>
        <head>  
          <meta charset="UTF-8">
          <title>Bem-vindo</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background-color: #f9f9f9; }
            .password { font-weight: bold; color: #1e40af; }
            .footer { margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Bem-vindo, ${userName}!</h1>
            </div>
            <div class="content">
              <p>Seu cadastro foi realizado com sucesso.</p>
              <p>Aqui estão suas credenciais de acesso:</p>
              <p><strong>Email:</strong> ${userName}</p>
            </div>
            <div class="footer">
              <p>Este é um email automático, por favor não responda.</p>
            </div>
          </div>
        </body>
        </html>
      `
  }
}
