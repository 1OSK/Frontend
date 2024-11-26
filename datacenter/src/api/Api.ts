/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DatacenterService {
  /** ID */
  id?: number;
  /**
   * Name
   * @minLength 1
   * @maxLength 255
   */
  name?: string;
  /** Description */
  description?: string | null;
  /**
   * Image url
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
  /**
   * Price
   * @min 0
   * @max 2147483647
   */
  price?: number | null;
}

export interface DatacenterOrderService {
  /** ID */
  id?: number;
  service?: DatacenterService;
  /**
   * Quantity
   * @min 0
   * @max 2147483647
   */
  quantity?: number | null;
}

export interface DatacenterOrder {
  /** ID */
  id?: number;
  /** Status */
  status?: "draft" | "deleted" | "formed" | "completed" | "rejected";
  /**
   * Creation date
   * @format date-time
   */
  creation_date?: string;
  /**
   * Formation date
   * @format date-time
   */
  formation_date?: string | null;
  /**
   * Completion date
   * @format date-time
   */
  completion_date?: string | null;
  /**
   * Creator name
   * @minLength 1
   */
  creator_name?: string;
  /**
   * Email модератора
   * @minLength 1
   */
  moderator_name?: string | null;
  /**
   * Delivery address
   * @maxLength 255
   */
  delivery_address?: string | null;
  /**
   * Delivery time
   * @format date-time
   */
  delivery_time?: string | null;
  /**
   * Total price
   * @min 0
   * @max 2147483647
   */
  total_price?: number | null;
  datacenters?: DatacenterOrderService[];
}

export interface DatacenterServiceImage {
  /**
   * Image url
   * @format uri
   * @maxLength 200
   */
  image_url?: string | null;
}

export interface Register {
  /**
   * Email
   * @format email
   * @minLength 1
   * @maxLength 255
   */
  email: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
}

export interface User {
  /**
   * Email
   * @format email
   * @minLength 1
   * @maxLength 255
   */
  email: string;
  /**
   * Password
   * @minLength 1
   */
  password: string;
  /**
   * Is staff
   * @default false
   */
  is_staff?: boolean;
  /**
   * Is superuser
   * @default false
   */
  is_superuser?: boolean;
}

import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, HeadersDefaults, ResponseType } from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({ ...axiosConfig, baseURL: axiosConfig.baseURL || "http://localhost:8000" });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method && this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title My Datacenter
 * @version v1
 * @license BSD License
 * @termsOfService https://www.google.com/policies/terms/
 * @baseUrl http://localhost:8000
 * @contact <contact@myapi.local>
 *
 * Test description
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  datacenterOrdersServices = {
    /**
     * @description Удаление товара из заказа
     *
     * @tags datacenter-orders-services
     * @name DatacenterOrdersServicesDatacenterServicesDeleteDelete
     * @request DELETE:/datacenter-orders-services/{datacenter_order_id}/datacenter-services/{datacenter_service_id}/delete/
     * @secure
     */
    datacenterOrdersServicesDatacenterServicesDeleteDelete: (
      datacenterOrderId: string,
      datacenterServiceId: string,
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/datacenter-orders-services/${datacenterOrderId}/datacenter-services/${datacenterServiceId}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Изменение количества товаров в заказе
     *
     * @tags datacenter-orders-services
     * @name DatacenterOrdersServicesDatacenterServicesUpdateUpdate
     * @request PUT:/datacenter-orders-services/{datacenter_order_id}/datacenter-services/{datacenter_service_id}/update/
     * @secure
     */
    datacenterOrdersServicesDatacenterServicesUpdateUpdate: (
      datacenterOrderId: string,
      datacenterServiceId: string,
      data: {
        /** Новое количество товаров */
        quantity: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/datacenter-orders-services/${datacenterOrderId}/datacenter-services/${datacenterServiceId}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  datacenterOrders = {
    /**
     * @description Возвращает список заказов с фильтрацией по статусу и дате создания.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersList
     * @summary Получить список заказов
     * @request GET:/datacenter-orders/
     * @secure
     */
    datacenterOrdersList: (
      query?: {
        /** Фильтр по статусу заказа */
        datacenter_status?: string;
        /** Начальная дата */
        datacenter_start_date?: string;
        /** Конечная дата */
        datacenter_end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<DatacenterOrder[], void>({
        path: `/datacenter-orders/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Возвращает информацию о конкретном заказе по его ID.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersRead
     * @summary Получить заказ
     * @request GET:/datacenter-orders/{id}/
     * @secure
     */
    datacenterOrdersRead: (id: string, params: RequestParams = {}) =>
      this.request<DatacenterOrder, void>({
        path: `/datacenter-orders/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Помечает заказ как удалённый.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersDeleteDelete
     * @summary Удалить заказ
     * @request DELETE:/datacenter-orders/{id}/delete/
     * @secure
     */
    datacenterOrdersDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/datacenter-orders/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * @description Завершает или отклоняет заказ по его ID.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersFinalizeUpdate
     * @summary Завершить или отклонить заказ
     * @request PUT:/datacenter-orders/{id}/finalize/
     * @secure
     */
    datacenterOrdersFinalizeUpdate: (
      id: string,
      data: {
        /** Действие: completed или rejected */
        action: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<void, void>({
        path: `/datacenter-orders/${id}/finalize/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description Подтверждает заказ по его ID.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersSubmitUpdate
     * @summary Подтвердить заказ
     * @request PUT:/datacenter-orders/{id}/submit/
     * @secure
     */
    datacenterOrdersSubmitUpdate: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/datacenter-orders/${id}/submit/`,
        method: "PUT",
        secure: true,
        ...params,
      }),

    /**
     * @description Обновляет данные заказа по его ID.
     *
     * @tags datacenter-orders
     * @name DatacenterOrdersUpdateUpdate
     * @summary Изменить заказ
     * @request PUT:/datacenter-orders/{id}/update/
     * @secure
     */
    datacenterOrdersUpdateUpdate: (id: string, data: DatacenterOrder, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/datacenter-orders/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
  datacenterServices = {
    /**
     * @description Возвращает список товаров с фильтрацией по цене.
     *
     * @tags datacenter-services
     * @name DatacenterServicesList
     * @summary Получить список товаров
     * @request GET:/datacenter-services/
     * @secure
     */
    datacenterServicesList: (
      query?: {
        /** Минимальная цена для фильтрации */
        datacenter_min_price?: number;
        /** Максимальная цена для фильтрации */
        datacenter_max_price?: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        DatacenterService[],
        {
          /** Описание ошибки */
          error?: string;
        }
      >({
        path: `/datacenter-services/`,
        method: "GET",
        query: query,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * @description Создает новый товар в базе данных.
     *
     * @tags datacenter-services
     * @name DatacenterServicesCreateCreate
     * @summary Создать новый товар
     * @request POST:/datacenter-services/create/
     * @secure
     */
    datacenterServicesCreateCreate: (data: DatacenterService, params: RequestParams = {}) =>
      this.request<DatacenterService, any>({
        path: `/datacenter-services/create/`,
        method: "POST",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags datacenter-services
     * @name DatacenterServicesRead
     * @summary Получить товар по ID
     * @request GET:/datacenter-services/{id}/
     * @secure
     */
    datacenterServicesRead: (id: string, params: RequestParams = {}) =>
      this.request<DatacenterService, any>({
        path: `/datacenter-services/${id}/`,
        method: "GET",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags datacenter-services
     * @name DatacenterServicesAddImageCreate
     * @summary Добавить изображение к товару
     * @request POST:/datacenter-services/{id}/add-image/
     * @secure
     */
    datacenterServicesAddImageCreate: (
      id: string,
      data: {
        /**
         * Изображение для добавления
         * @format binary
         */
        image?: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<DatacenterServiceImage, void>({
        path: `/datacenter-services/${id}/add-image/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags datacenter-services
     * @name DatacenterServicesAddToDraftCreate
     * @summary Добавить товар в черновик заказа
     * @request POST:/datacenter-services/{id}/add-to-draft/
     * @secure
     */
    datacenterServicesAddToDraftCreate: (id: string, params: RequestParams = {}) =>
      this.request<DatacenterOrder, void>({
        path: `/datacenter-services/${id}/add-to-draft/`,
        method: "POST",
        secure: true,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags datacenter-services
     * @name DatacenterServicesDeleteDelete
     * @summary Удалить товар
     * @request DELETE:/datacenter-services/{id}/delete/
     * @secure
     */
    datacenterServicesDeleteDelete: (id: string, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/datacenter-services/${id}/delete/`,
        method: "DELETE",
        secure: true,
        ...params,
      }),

    /**
     * No description
     *
     * @tags datacenter-services
     * @name DatacenterServicesUpdateUpdate
     * @summary Обновить товар
     * @request PUT:/datacenter-services/{id}/update/
     * @secure
     */
    datacenterServicesUpdateUpdate: (id: string, data: DatacenterService, params: RequestParams = {}) =>
      this.request<DatacenterService, void>({
        path: `/datacenter-services/${id}/update/`,
        method: "PUT",
        body: data,
        secure: true,
        format: "json",
        ...params,
      }),
  };
  users = {
    /**
     * @description Создает нового пользователя с указанными данными.
     *
     * @tags users
     * @name UsersCreate
     * @summary Регистрация пользователя
     * @request POST:/users/
     * @secure
     */
    usersCreate: (data: Register, params: RequestParams = {}) =>
      this.request<
        {
          /** Email пользователя */
          email?: string;
        },
        void
      >({
        path: `/users/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Аутентификация пользователя по email и паролю.
     *
     * @tags users
     * @name UsersLoginCreate
     * @summary Вход пользователя
     * @request POST:/users/login/
     * @secure
     */
    usersLoginCreate: (
      data: {
        /** Email пользователя */
        email: string;
        /** Пароль пользователя */
        password: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          /** Email пользователя */
          email?: string;
          /** Access токен */
          access?: string;
          /** Refresh токен */
          refresh?: string;
        },
        void
      >({
        path: `/users/login/`,
        method: "POST",
        body: data,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Разлогинивает пользователя.
     *
     * @tags users
     * @name UsersLogoutCreate
     * @summary Выход пользователя
     * @request POST:/users/logout/
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/logout/`,
        method: "POST",
        secure: true,
        ...params,
      }),

    /**
     * @description Частично обновляет данные пользователя.
     *
     * @tags users
     * @name UsersUpdateUpdate
     * @summary Обновление информации о пользователе
     * @request PUT:/users/update/
     * @secure
     */
    usersUpdateUpdate: (data: User, params: RequestParams = {}) =>
      this.request<void, void>({
        path: `/users/update/`,
        method: "PUT",
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),
  };
}
