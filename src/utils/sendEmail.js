import nodemailer from 'nodemailer'
import { logger } from './logger.js'
import config from '../config/config.js'

export const sendEmail = async (email, resetUrl) => {
    
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: config.userEmail,
                pass: config.passEmail
            },
        })

        await transporter.sendMail({
            from: `Ecommerce <seba.illa.prueba@gmail.com>`,
            to: `${email}`,
            subject: 'Cambiar Password',
            html: templateHtmlEmail(email, resetUrl)
        })

    } catch (error) {
        logger.error(`Error en sendEmail - ${new Date().toLocaleString()}`, error)
    }
}

const templateHtmlEmail = (email, resetUrl) => {
    const titulo = 'Cambiar password'
    const link = resetUrl

    return (
        `<div style="margin:0;padding:0" dir="ltr" bgcolor="#ffffff">
        <table border="0" cellspacing="0" cellpadding="0" align="center" id="m_-7650884979018722939email_table"
            style="border-collapse:collapse">
            <tbody>
                <tr>
                    <td id="m_-7650884979018722939email_content"
                        style="font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;background:#ffffff">
                        <table border="0" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse">
                            <tbody>
                                <tr>
                                    <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td height="1" colspan="3" style="line-height:1px"></td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" width="100%" cellspacing="0" cellpadding="0"
                                            style="border-collapse:collapse;text-align:center;width:100%">
                                            <tbody>
                                                <tr>
                                                    <td width="15px" style="width:15px"></td>
                                                    <td style="line-height:0px;max-width:600px;padding:0 0 15px 0">
                                                    </td>
                                                    <td width="15px" style="width:15px"></td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" width="430" cellspacing="0" cellpadding="0"
                                            style="border-collapse:collapse;margin:0 auto 0 auto">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <table border="0" width="430px" cellspacing="0" cellpadding="0"
                                                            style="border-collapse:collapse;margin:0 auto 0 auto;width:430px">
                                                            <tbody>
                                                                <tr>
                                                                    <td width="15" style="display:block;width:15px">
                                                                        &nbsp;&nbsp;&nbsp;</td>
                                                                </tr>
                                                                <tr>
                                                                    <td width="12" style="display:block;width:12px">
                                                                        &nbsp;&nbsp;&nbsp;</td>
                                                                    <td>
                                                                        <table border="0" width="100%" cellspacing="0"
                                                                            cellpadding="0"
                                                                            style="border-collapse:collapse">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td
                                                                                        style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                        <p
                                                                                            style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                            Hola,</p>
                                                                                        <p
                                                                                            style="margin:10px 0 10px 0;color:#565a5c;font-size:18px">
                                                                                            Alguien esta intentando ${titulo} con <a
                                                                                                href="mailto:${email}"
                                                                                                target="_blank">${email}</a>.
                                                                                            Omitir email en caso de que no fuiste vos
                                                                                        </p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td></td>
                                                                                    <td style="padding:10px;color:#565a5c;font-size:32px;font-weight:500;text-align:center;padding-bottom:25px">
            <a href="${link}" style="text-decoration: none; color: #007bff;">Haz clic aquí para restablecer tu contraseña</a>
        </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <table border="0" cellspacing="0" cellpadding="0"
                                            style="border-collapse:collapse;margin:0 auto 0 auto;width:100%;max-width:600px">
                                            <tbody>
                                                <tr>
                                                    <td height="4" style="line-height:4px" colspan="3">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td width="15px" style="width:15px"></td>
                                                    <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                    <td style="text-align:center">
                                                        <div style="height:10px"></div>
                                                    </td>
                                                    <td width="20" style="display:block;width:20px">&nbsp;&nbsp;&nbsp;</td>
                                                    <td width="15px" style="width:15px"></td>
                                                </tr>
                                                <tr>
                                                    <td height="32" style="line-height:32px" colspan="3">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td height="20" style="line-height:20px" colspan="3">&nbsp;</td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    `);
}