/* eslint-disable */
import AuthService from "../services/authService"

class LoginController {
  public renderLoginPage(req: any, res: any): void {
    res.render('login')
  }

  public async handleLoginRequest(req: any, res: any): Promise<void> {
    try {
      console.log(req.body)
      const username = req.body.username
      const password = req.body.password

      const result = await AuthService.handleLoginRequest(username, password);
      res.send(result);
    } catch (error: any) {
        res.status(500).send({ error: error.message })
    }
  }

}

export const loginController = new LoginController()
