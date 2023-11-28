/* eslint-disable */
import { Response } from 'express'

class UserController {
  // login
  login = async (req: any, res: Response) => {
    if (req.session.user) {
      console.log(req.session.user)
      res.render('index', { title: 'Express' })
    } else {
      req.session.error = 'Please login'
      res.redirect('login')
    }
  }
}

export const userController = new UserController()
