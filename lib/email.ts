import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Inmobiliaria <onboarding@resend.dev>'

export async function sendPaymentConfirmationEmail(
  to: string,
  data: {
    nombre: string
    monto: string
    referencia: string | null
    lote: string
    fecha: string
    metodoPago: string
  }
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Confirmacion de Pago - Lote ${data.lote}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #C2410C; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Confirmacion de Pago</h1>
          </div>
          <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
            <p style="color: #374151; font-size: 16px;">Hola <strong>${data.nombre}</strong>,</p>
            <p style="color: #374151;">Tu pago ha sido registrado exitosamente. A continuacion los detalles:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #6b7280; font-weight: 600;">Lote</td>
                <td style="padding: 12px; color: #111827;">${data.lote}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #6b7280; font-weight: 600;">Monto</td>
                <td style="padding: 12px; color: #111827; font-weight: 700;">${data.monto}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #6b7280; font-weight: 600;">Metodo de Pago</td>
                <td style="padding: 12px; color: #111827;">${data.metodoPago}</td>
              </tr>
              ${data.referencia ? `
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #6b7280; font-weight: 600;">Referencia</td>
                <td style="padding: 12px; color: #111827;">${data.referencia}</td>
              </tr>
              ` : ''}
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 12px; color: #6b7280; font-weight: 600;">Fecha</td>
                <td style="padding: 12px; color: #111827;">${data.fecha}</td>
              </tr>
            </table>
            <p style="color: #6b7280; font-size: 14px;">El pago sera revisado por nuestro equipo administrativo. Recibirás una notificacion cuando sea aprobado.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">Terranova Inmobiliaria - Tu hogar te espera</p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending payment confirmation email:', error)
    return { error: 'Error al enviar email' }
  }
}

export async function sendPasswordRecoveryEmail(
  to: string,
  data: {
    nombre: string
    resetUrl: string
  }
) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Recuperar Contrasena - Inmobiliaria',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #C2410C; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Recuperar Contrasena</h1>
          </div>
          <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
            <p style="color: #374151; font-size: 16px;">Hola <strong>${data.nombre}</strong>,</p>
            <p style="color: #374151;">Recibimos una solicitud para restablecer tu contrasena. Haz clic en el boton de abajo para crear una nueva:</p>
            <div style="text-align: center; margin: 32px 0;">
              <a href="${data.resetUrl}" style="background-color: #C2410C; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; display: inline-block;">
                Restablecer Contrasena
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Este enlace expirara en 1 hora. Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 12px; text-align: center;">Terranova Inmobiliaria - Tu hogar te espera</p>
          </div>
        </div>
      `,
    })
    return { success: true }
  } catch (error) {
    console.error('Error sending password recovery email:', error)
    return { error: 'Error al enviar email' }
  }
}
