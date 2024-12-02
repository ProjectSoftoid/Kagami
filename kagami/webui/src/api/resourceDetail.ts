import api from './api';


export enum Resourcestatus{
    ONLINE = "ONLINE",
    OFFLINE = "OFFLINE",
    ERROR = "ERROR"

};

export type ResourceDetail = {
    name:string;
    upstream_url:string;
    workers:{
        name:string;
        replica_id:number;
        provider_method:string;
        status:Resourcestatus
    }
};
export const getResourceDetail = async (resource_name: string): Promise<ResourceDetail> => {
    try {
      const response = await api.get(`/resource_detail/${resource_name}`);
      return response.data as ResourceDetail;
    } catch (error) {
      console.error('获取资源详情失败:', error);
      throw error;
    }
  };
