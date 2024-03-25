import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { isEmail } from 'class-validator'
import { Repository } from 'typeorm'

import { CreateAppealDto } from 'src/modules/main/dto/requests/create-appeal.dto'

import { Appeal } from 'src/modules/main/entities/appeal.entity'

@Injectable()
export class AppealService {
  constructor(
    @InjectRepository(Appeal)
    private appealRepository: Repository<Appeal>,
  ) {}

  async createAppeal(data: CreateAppealDto) {
    const count = await this.appealRepository.count()
    if (count >= 100) {
      throw new Error('Ліміт збережених записів перевищено')
    }

    if (!isEmail(data.email)) {
      throw new Error('Невірний формат електронної пошти')
    } else {
      const existingAppeal = await this.appealRepository.findOne({ where: { email: data.email } })
      if (existingAppeal) {
        throw new Error('Email уже існує в системі')
      }
    }

    const currentDate = new Date()
    const appealDate = new Date(data.finishedAt)
    const maxDate =
      data.type === 'revalidation'
        ? new Date(currentDate.getFullYear() - 2, currentDate.getMonth(), currentDate.getDate())
        : new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), currentDate.getDate())

    if (isNaN(appealDate.getTime()) || appealDate < maxDate) {
      throw new Error('Невірний формат дати finishedAt')
    }

    if (data.type !== 'join' && data.type !== 'revalidation') {
      throw new Error('Недопустиме значення для поля type')
    }

    if (!this.validateIPN(data.ipn)) {
      throw new Error('Неправильне значення IPN')
    }

    const ageFromIPN = this.calculateAgeFromIPN(data.ipn)
    if (BigInt(data.age) !== ageFromIPN) {
      throw new Error('Невірне значення віку')
    }

    const newAppeal = this.appealRepository.create(data)

    await this.appealRepository.save(newAppeal)

    return { message: 'Запис успішно створено' }
  }

  private validateIPN(ipn: bigint): boolean {
    const ipnString = ipn.toString()
    const digits = ipnString.split('').map(Number)

    if (!/^\d{10}$/.test(ipnString)) {
      return false
    }

    const controlSum =
      digits[0] * -1 +
      digits[1] * 5 +
      digits[2] * 7 +
      digits[3] * 9 +
      digits[4] * 4 +
      digits[5] * 6 +
      digits[6] * 10 +
      digits[7] * 5 +
      digits[8] * 7

    let controlNumber = (controlSum % 11) % 10
    if (controlNumber < 0) {
      controlNumber += 10
    }

    if (controlNumber !== digits[9]) {
      return false
    }

    const age = this.calculateAgeFromIPN(ipn)
    if (age === null || age < 0 || age > 150) {
      return false
    }

    const genderCode = digits[8] % 2 === 0 ? 'female' : 'male'
    const genderFromIPN = digits[4] % 2 === 0 ? 'female' : 'male'
    if (genderCode !== genderFromIPN) {
      return false
    }

    return true
  }

  private calculateAgeFromIPN(ipn: bigint): bigint | null {
    const ipnString = ipn.toString()
    const birthDateStr = ipnString.substr(0, 5)

    const day = BigInt(parseInt(birthDateStr.substr(0, 2)))
    const month = BigInt(parseInt(birthDateStr.substr(2, 2)))
    const daysSince1899 = BigInt(parseInt(birthDateStr))
    const birthDate = new Date(1899, 11, 31)

    birthDate.setDate(birthDate.getDate() + Number(daysSince1899))

    let year = BigInt(birthDate.getFullYear())

    if (year >= 0 && year <= 20) {
      year += BigInt(2000)
    } else if (year >= 80 && year <= 99) {
      year += BigInt(1800)
    } else if (year >= 21 && year <= 32) {
      year += BigInt(1900)
    } else if (year >= 40 && year <= 49) {
      year += BigInt(1800)
    } else if (year >= 50 && year <= 99) {
      year += BigInt(1900)
    }

    const currentDate = new Date()
    const currentYear = BigInt(currentDate.getFullYear())
    const currentMonth = BigInt(currentDate.getMonth() + 1)
    const currentDay = BigInt(currentDate.getDate())

    let age = currentYear - year

    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
      age -= BigInt(1)
    }

    if (isNaN(Number(year))) {
      console.log('Помилка: невірний рік народження.')

      return null
    }

    return age
  }
}
