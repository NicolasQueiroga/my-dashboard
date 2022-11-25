interface IngressProps {
    protocol: string;
    from_port: string;
    to_port: string;
    cidr_blocks: string[];
}

interface SecurityGroupProps {
    id: string;
    name: string;
    description: string;
    ingress: IngressProps[];
    egress: IngressProps[];
}

interface PolicyProps {
    name: string;
    description: string;
    actions: string[];
    resources: string[];
}

interface UserGroupProps {
    id: string;
    name: string;
    description: string;
    restrictions: PolicyProps;
}

interface UserProps {
    id: string;
    groups_ids: string[];
    name: string;
    restrictions: PolicyProps;
}

interface InstanceProps {
    name: string;
    ami: string;
    instance_type: string;
    region: string;
    security_groups_ids: string[];
}

interface JsonProps {
    security_groups: SecurityGroupProps[];
    user_groups: UserGroupProps[];
    users: UserProps[];
    instances: InstanceProps[];
}


// ---------------------
interface ValueProps {
    availability_zones: string[];
}

interface NetworkProps {
    value: ValueProps;
}

interface OutputsProps {
    network: NetworkProps;
}