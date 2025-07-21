import axios, {AxiosInstance, AxiosResponse, AxiosRequestConfig} from 'axios';

export class Api {
  private readonly instance: AxiosInstance;

  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private async handleRequest<T>(
    request: () => Promise<AxiosResponse<T>>,
  ): Promise<AxiosResponse<T>> {
    try {
      return await request();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'API request failed.');
      } else {
        throw new Error('An unexpected error occurred.');
      }
    }
  }

  private getAuthHeader(token: string): AxiosRequestConfig['headers'] {
    return {Authorization: `Bearer ${token}`};
  }

  // 🔹Register user
  public register(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.handleRequest(() =>
      this.instance.post('/account/register', data),
    );
  }

  // 🔹Login
  public login(data: {
    email: string;
    password: string;
  }): Promise<AxiosResponse> {
    return this.handleRequest(() => this.instance.post('/account/login', data));
  }

  // 🔹Verify email
  public verifyEmail(data: {
    email: string;
    tempOtp: string;
  }): Promise<AxiosResponse> {
    return this.handleRequest(() =>
      this.instance.post('/account/verify', data),
    );
  }

  // 🔹Resend OTP
  public resendOtp(data: {email: string}): Promise<AxiosResponse> {
    return this.handleRequest(() =>
      this.instance.post('/account/resend', data),
    );
  }

  // 🔹Forget password
  public forgetPassword(data: {email: string}): Promise<AxiosResponse> {
    return this.handleRequest(() =>
      this.instance.post('/account/forget', data),
    );
  }

  // 🔹Change password
  public changePassword(data: {
    email: string;
    oldPassword: string;
    newPassword: string;
  }): Promise<AxiosResponse> {
    return this.handleRequest(() =>
      this.instance.post('/account/change', data),
    );
  }

  // 🔹Profile
  public getUserProfile(token: string): Promise<AxiosResponse | null> {
    return this.handleRequest(() =>
      this.instance.get('/account/profile', {
        headers: this.getAuthHeader(token),
      }),
    );
  }

  // 🔹Scan URL
  public scanUri(data: {inputUrl: string}): Promise<AxiosResponse> {
    return this.handleRequest(() => this.instance.post('/url', data));
  }

  // 🔹Check Domain Reputation
  public checkDomainReputation(data: {inputUrl: string}): Promise<AxiosResponse> {
    return this.handleRequest(() => this.instance.post('/domain-reputation', data));
  }

  // 🔹Check Data Breach
  public checkDataBreach(data: {email: string}): Promise<AxiosResponse> {
    return this.handleRequest(() => this.instance.post('/breach', data));
  }

  //🔹Fetch cyber news
  public getCyberNews(): Promise<AxiosResponse> {
    return this.handleRequest(() => this.instance.get('/cyber-news'));
  }
}
