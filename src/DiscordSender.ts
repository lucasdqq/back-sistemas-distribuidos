import axios, { AxiosResponse } from "axios";

export class DiscordErrorSender {
  private static readonly WEBHOOK_URL: string =
    "https://discord.com/api/webhooks/1386810073761841223/4uwB1YeU9agZJoiZBDY-Z0lNgSb7dZHKpJYxhQm6Tx-CRa0e9Ql5pu4zl9jilTjqb4lx";

  public static async SendError(error: string): Promise<void> {
    const payload = {
      content: `**ERRO**: ${error}\n🕒 ${new Date().toISOString()}`,
    };

    try {
      const response: AxiosResponse = await axios.post(
        this.WEBHOOK_URL,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        console.log(`Mensagem enviada com sucesso! Status: ${response.status}`);
      } else {
        console.error(`Falha ao enviar mensagem. Status: ${response.status}`);
        console.error(`Resposta: ${JSON.stringify(response.data)}`);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem para o Discord:");
      if (axios.isAxiosError(error)) {
        console.error(
          `Erro HTTP: ${error.response?.status} - ${error.message}`
        );
      } else {
        console.error(error);
      }
    }
  }
}
