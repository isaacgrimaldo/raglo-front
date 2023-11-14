import { AxiosInstance } from "axios";
import { UserDto } from "./dtos/UserDto";
import { AppGateWay } from "../AppGateWay";


class UserService {
  constructor(private readonly ApiGetWay: AxiosInstance) { }

  
  async getUserByName(name: string): Promise<UserDto> {
    try {
      const users = (await this.ApiGetWay.get<UserDto>('/users/'+ name.replace(' ', '_'))).data
      return users
    } catch (error) {
      throw new Error(String(error))
    }
  }

  async getUser(): Promise<UserDto[]> {
    try {
      const users = (await this.ApiGetWay.get<UserDto[]>('/users/')).data
      return users
    } catch (error) {
      throw new Error(String(error))
    }
  }

  async createUser(name: string): Promise<UserDto> {
    try {
      const users = (await this.ApiGetWay.post<UserDto>('/users/', {
        name: name
      })).data

      return users
    } catch (error) {
      throw new Error(String(error))
    }
  }

  async updateUser(user: Partial<UserDto>, id:number): Promise<UserDto> {
    try {
     const result = (await this.ApiGetWay.put<UserDto>('/users/'+ id, {
        ...user
      })).data

      return result
    } catch (error) {
      throw new Error(String(error))
    }
  }

  async delete(id:number): Promise<void> {
    try {
     await this.ApiGetWay.delete<UserDto>('/users/'+ id)
    } catch (error) {
      throw new Error(String(error))
    }
  }
}


const newUserService = new UserService(AppGateWay)

export default newUserService