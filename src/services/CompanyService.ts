import { ICreateCompanyDTO } from "../dtos/CompanyDTO";
import { Company } from "../entities/Company";
import { CompanyRepository } from "../repositories/CompanyRepository";
import { errorMessage, errorStatus } from "../utils/constants/ErrorConstants";
import { DeleteResult } from "typeorm/index";

export default class CompanyService {
  private readonly companyRepository: CompanyRepository;

  constructor() {
    this.companyRepository = new CompanyRepository();
  }

  public async create(data: ICreateCompanyDTO): Promise<Company | undefined> {
    const company = await this.companyRepository.create(data);
    if (!company) throw { status: errorStatus.internal_server_error, message: errorMessage.cannot_create_company };
    const companyCreated = await this.companyRepository.findById(company.id.toString());
    return companyCreated;
  }

  public async findById(id: string): Promise<Company | undefined> {
    const company = await this.companyRepository.findById(id);
    if (!company) throw { status: errorStatus.bad_request, message: errorMessage.id_not_found };

    return company;
  }

  public async findAll(): Promise<Company[] | undefined> {
    const companies = await this.companyRepository.findAll();
    if (companies.length == 0) throw {status: errorStatus.bad_request, message: errorMessage.could_not_find}
    return companies;
  }

  public async update(id: string, data: ICreateCompanyDTO): Promise<Company | undefined> {
    const company = await this.companyRepository.findById(id);
    if(!company) throw { status: errorStatus.bad_request, message: errorMessage.id_not_found}
    const assign = Object.assign(company, data);
    await this.companyRepository.save(assign);
    const companyUpdated = await this.companyRepository.findById(id);
    return companyUpdated;
  }

  public async delete(id: string): Promise<DeleteResult> {
    const company =  await this.companyRepository.deleteById(id);
    if (company.affected == 0) throw { status: errorStatus.bad_request, message: errorMessage.id_not_found}
    return company
  }
}
