import styles from '../styles/components/Resume.module.css'
import axios from "axios";
import Loading from './Loading';
import { useState } from 'react';

const LOUNCH_ENDPOINT = "http://0.0.0.0:8000/api/aws/launch/";

export default function Resume({ json, setPage }: ({ json: JsonProps, setPage: Function })) {
    const securityGroups: Array<SecurityGroupProps> = json.security_groups;
    const instances: Array<InstanceProps> = json.instances;
    const userGroups: Array<UserGroupProps> = json.user_groups;
    const users: Array<UserProps> = json.users;
    const [loading, setLoading] = useState<boolean>(false);

    async function launch() {
        try {
            setLoading(true);
            const response = await axios.post(LOUNCH_ENDPOINT, { json });
            console.log(response);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
        setPage(0);
    }

    function showSecurityGroups() {
        return (
            <>
                {securityGroups.map((securityGroup: SecurityGroupProps) => (
                    <div className={styles.securityGroup} key={securityGroup.id}>
                        <p className={styles.name}>{securityGroup.name}</p>
                        <div className={styles.rulesContainer}>
                            {securityGroup.ingress.map((rule, index: number) => (
                                <div className={styles.rule} key={index}>
                                    <p className={styles.ruleTitle}>From: {rule.from_port}</p>
                                    <p className={styles.ruleTitle}>To: {rule.to_port}</p>
                                    <p className={styles.ruleTitle}>Protocol: {rule.protocol}</p>
                                    <div className={styles.cidrBlocks}>
                                        {rule.cidr_blocks.map((cidrBlock, index: number) => (
                                            <div className={styles.cidrBlock} key={index}>
                                                <p className={styles.cidrBlockTitle}>{cidrBlock}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showInstances() {
        return (
            <>
                {instances.map((instance: InstanceProps, k) => (
                    <div className={styles.instance} key={k}>
                        <p className={styles.name}>{instance.name}</p>
                        <p className={styles.type}>Type: {instance.instance_type}</p>
                        <div className={styles.securityGroupsItems}>
                            {instance.security_groups_ids.map((securityGroupId, index: number) => {
                                let sgName = "";
                                securityGroups.forEach((securityGroup: SecurityGroupProps) => {
                                    if (securityGroup.id == securityGroupId) {
                                        sgName = securityGroup.name;
                                    }
                                })
                                return (
                                    <div className={styles.securityGroupsItem} key={index}>
                                        <p className={styles.securityGroupName}>{sgName}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showUserGroups() {
        return (
            <>
                {userGroups.map((userGroup: UserGroupProps, k) => (
                    <div className={styles.userGroup} key={k}>
                        <p className={styles.name}>{userGroup.name}</p>
                        <p className={styles.description}>{userGroup.description}</p>
                        <div className={styles.restrictions}>
                            <div className={styles.actions}>
                                <p className={styles.actionsTitle}>Actions</p>
                                {userGroup.restrictions.actions.map((action, index: number) => (
                                    <div className={styles.action} key={index}>
                                        <p className={styles.actionTitle}>{action}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.resources}>
                                <p className={styles.resourcesTitle}>Resources</p>
                                {userGroup.restrictions.resources.map((resource, index: number) => (
                                    <div className={styles.resource} key={index}>
                                        <p className={styles.resourceTitle}>{resource}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    function showUsers() {
        return (
            <>
                {users.map((user: UserProps, k) => (
                    <div className={styles.user} key={k}>
                        <p className={styles.name}>{user.name}</p>
                        <p className={styles.userGroupsTitle}>User Groups</p>
                        <div className={styles.userGroupsList}>
                            {user.groups_ids.map((userGroupId, index: number) => {
                                let userGroupName = "";
                                userGroups.forEach((userGroup: UserGroupProps) => {
                                    if (userGroup.id == userGroupId) {
                                        userGroupName = userGroup.name;
                                    }
                                })
                                return (
                                    <div className={styles.userGroupName} key={index}>
                                        <p className={styles.userGroupNameTitle}>{userGroupName}</p>
                                    </div>
                                )
                            })}
                        </div>
                        <div className={styles.userRestrictions}>
                            <div className={styles.userActions}>
                                <p className={styles.actionsTitle}>Actions</p>
                                {user.restrictions.actions && user.restrictions.actions.map((action, index: number) => (
                                    <div className={styles.userAction} key={index}>
                                        <p className={styles.actionTitle}>{action}</p>
                                    </div>
                                ))}
                            </div>
                            <div className={styles.userResources}>
                                <p className={styles.resourcesTitle}>Resources</p>
                                {user.restrictions.resources && user.restrictions.resources.map((resource, index: number) => (
                                    <div className={styles.userResource} key={index}>
                                        <p className={styles.resourceTitle}>{resource}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </>
        )
    }

    return loading ? (
        <>
            <Loading />
        </>
    ) : (
        <div className={styles.container}>
            <p className={styles.title}>Resume</p>

            <div className={styles.resume}>
                <p className={styles.fieldTitle}>Security Groups</p>
                <div className={styles.securityGroups}>
                    {securityGroups.length > 0 && showSecurityGroups()}
                </div>
                <p className={styles.fieldTitle}>Instances</p>
                <div className={styles.instances}>
                    {instances.length > 0 && showInstances()}
                </div>
                <p className={styles.fieldTitle}>User Groups</p>
                <div className={styles.userGroups}>
                    {userGroups.length > 0 && showUserGroups()}
                </div>
                <p className={styles.fieldTitle}>Users</p>
                <div className={styles.users}>
                    {users.length > 0 && showUsers()}
                </div>
            </div>
            <button className={styles.btn} onClick={async () => { await launch(); }}>Generate</button>
            <br />
            <br />
        </div>
    )
}