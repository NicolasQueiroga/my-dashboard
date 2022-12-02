import styles from '../styles/components/Users.module.css'
import { useState, useEffect } from "react";


export default function Users({ json, setJson }: ({ json: JsonProps, setJson: Function })) {
  const [users, setUsers] = useState<Array<UserProps>>(json.users);
  const [createU, setCreateU] = useState(false);
  const [activeUser, setActiveUser] = useState("");

  let dummy: UserProps = {
    id: "",
    name: "",
    groups_ids: [],
    restrictions: {
      name: "ChangePassword",
      description: "Change Password Only",
      actions: ["iam:ChangePassword"],
      resources: ["*"]
    }
  };
  const [newUser, setNewUser] = useState(dummy);

  useEffect(() => {
    setUsers(json.users);
  }, [json.users]);


  function deleteUser(name: string) {
    let newJson = { ...json };
    newJson.users = newJson.users.filter((user) => user.name !== name);
    setJson(newJson);
  }

  function addUser(data: UserProps) {
    console.log("addUserrr -> ", data);
    let newJson: JsonProps = { ...json };
    if (newJson.users.length === 0) {
      data.id = "1";
    } else {
      data.id = (parseInt(newJson.users[newJson.users.length - 1].id) + 1).toString();
    }
    data.restrictions.name += `Of${data.name}`;
    newJson.users.push(data);
    setJson(newJson);
    setNewUser(
      {
        id: "",
        name: "",
        groups_ids: [],
        restrictions: {
          name: "ChangePassword",
          description: "Change Password Only",
          actions: ["iam:ChangePassword"],
          resources: ["*"]
        }
      }
    );
  }

  function updateUser(data: UserProps) {
    let newJson: JsonProps = { ...json };
    newJson.users.map((user) => {
      if (user.id === data.id) {
        user.name = data.name;
        user.groups_ids = data.groups_ids;
        user.restrictions = data.restrictions;
      }
    });
    setJson(newJson);
    setNewUser(
      {
        id: "",
        name: "",
        groups_ids: [],
        restrictions: {
          name: "ChangePassword",
          description: "Change Password Only",
          actions: ["iam:ChangePassword"],
          resources: ["*"]
        }
      }
    );

  }

  function showUsers() {
    return users.length === 0 ? (
      <div className={styles.noU}>
        <p>No Users</p>
      </div>
    ) : (
      <div className={styles.users}>
        {users.map((user, index) => (
          <div className={styles.user} key={index} onClick={() => { setActiveUser(user.id) }}>
            <p className={styles.name}>{user.name}</p>
            <div className={styles.groupsContainer}>
              {user.groups_ids.map((groupId, index) => {
                let ugName = "";
                json.user_groups.forEach((secGroup) => {
                  if (secGroup.id == groupId)
                    ugName = secGroup.name;
                });
                return (
                  <div className={styles.group} key={index}>
                    <p className={styles.groupName}>{ugName}</p>
                  </div>
                )
              })}
            </div>
            <div className={styles.restrictionsContainer}>
              <p className={styles.restrictionsName}>{user.restrictions.name}</p>
            </div>
            <div className={styles.btns}>
              <button className={styles.btn} onClick={(e) => {
                deleteUser(user.name);
                e.stopPropagation();
              }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  function showUser(index: number) {
    dummy = { ...users[index] };
    return (
      <div className={styles.userFocus}>
        <input className={styles.name} type="text" placeholder="Name" defaultValue={dummy.name} onChange={(e) => {
          dummy.name = e.target.value;
        }} />
        <br />
        <br />
        <div className={styles.groupsContainer}>
          {json.user_groups.map((group, index) => {
            return (
              <div className={styles.group} key={index}>
                <input type="checkbox" defaultChecked={dummy.groups_ids.includes(group.id)} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.groups_ids.push(group.id);
                  } else {
                    dummy.groups_ids = dummy.groups_ids.filter((id) => id !== group.id);
                  }
                }
                } />
                <label>{group.name}</label>
              </div>
            )
          })}
        </div>
        <br />
        <div className={styles.restrictionsContainer}>
          <input className={styles.restrictionsName} type="text" placeholder="Restrictions" defaultValue={dummy.restrictions.name} onChange={(e) => {
            dummy.restrictions.name = e.target.value;
          }
          } />
          <input className={styles.restrictionsName} type="text" placeholder="Description" defaultValue={dummy.restrictions.description} onChange={(e) => {
            dummy.restrictions.description = e.target.value;
          }
          } />
          <div className={styles.restrictions}>
            <br />
            <div className={styles.restrictionsActions}>
              {dummy.restrictions.actions.map((action, index) => {
                return (
                  <div className={styles.action} key={index}>
                    <input className={styles.restrictionAction} type="text" placeholder="Action" defaultValue={action} onChange={(e) => {
                      dummy.restrictions.actions[index] = e.target.value;
                    }} />
                    {dummy.restrictions.actions.length - 1 === index && (
                      <div className={styles.btns}>
                        {dummy.restrictions.actions.length > 1 && (
                          <button className={styles.btn} onClick={() => {
                            dummy.restrictions.actions.splice(index, 1);
                            setNewUser(dummy);
                          }}>X</button>
                        )}
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.actions.push("");
                          setNewUser(dummy);
                        }}>+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <div className={styles.restrictionsResources}>
              {dummy.restrictions.resources.map((resource, index) => {
                return (
                  <div className={styles.resource} key={index}>
                    <input className={styles.restrictionResource} type="text" placeholder="Resource" defaultValue={resource} onChange={(e) => {
                      dummy.restrictions.resources[index] = e.target.value;
                    }} />
                    {dummy.restrictions.resources.length - 1 === index && (
                      <div className={styles.btns}>
                        {dummy.restrictions.resources.length > 1 && (
                          <button className={styles.btn} onClick={() => {
                            dummy.restrictions.resources.splice(index, 1);
                            setNewUser(dummy);
                          }}>X</button>
                        )}
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.resources.push("");
                          setNewUser(dummy);
                        }}>+</button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <br />
        <button className={styles.btn} onClick={() => {
          updateUser(dummy);
          setActiveUser("");
        }}>Update</button>
      </div>
    )
  }


  function createUser() {
    dummy = { ...newUser };
    return (
      <div className={styles.userFocus}>
        <h2>Create User</h2>
        <input type="text" name="username" placeholder="Username" onChange={(e) => {
          dummy.name = e.target.value;
        }} />
        <br />
        <br />
        <div className={styles.groupsContainer}>
          {json.user_groups.map((ug, index) => {
            return (
              <div className={styles.group} key={index}>
                <input type="checkbox" name="ug" value={ug.id} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.groups_ids.push(e.target.value);
                  } else {
                    dummy.groups_ids = dummy.groups_ids.filter((ug) => {
                      return ug != e.target.value;
                    })
                  }
                  console.log(dummy.groups_ids);
                }} />
                <label>{ug.name}</label>
              </div>
            )
          })}
        </div>
        <br />
        <div className={styles.restrictionsContainer}>
          <input type="text" name="restrictionsName" placeholder="Restriction Name" onChange={(e) => {
            dummy.restrictions.name = e.target.value;
          }} />
          <input type="text" name="description" placeholder="Description" onChange={(e) => {
            dummy.restrictions.description = e.target.value;
          }} />
          <div className={styles.restrictions}>
            <br />
            <div className={styles.restrictionsActions}>
              {newUser.restrictions.actions.map((action, index) => {
                return (
                  <div className={styles.action} key={index}>
                    <input className={styles.restrictionAction} type="text" name="action" placeholder="Action" onChange={(e) => {
                      dummy.restrictions.actions[index] = e.target.value;
                    }} />
                    {newUser.restrictions.actions.length - 1 === index && (
                      <div className={styles.btns}>
                        {newUser.restrictions.actions.length > 1 && (
                          <button className={styles.btn} onClick={() => {
                            dummy.restrictions.actions.splice(index, 1);
                            setNewUser(dummy);
                          }}>X</button>
                        )}
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.actions.push("");
                          setNewUser(dummy);
                        }}>+</button>
                      </div>
                    )}
                  </div>
                )
              })
              }
            </div>
            <div className={styles.restrictionsResources}>
              {newUser.restrictions.resources.map((resource, index) => {
                return (
                  <div className={styles.resource} key={index}>
                    <input className={styles.restrictionResource} type="text" name="resource" placeholder="Resource" onChange={(e) => {
                      dummy.restrictions.resources[index] = e.target.value;
                    }} />
                    {newUser.restrictions.resources.length - 1 === index && (
                      <div className={styles.btns}>
                        {newUser.restrictions.resources.length > 1 && (
                          <button className={styles.btn} onClick={() => {
                            dummy.restrictions.resources.splice(index, 1);
                            setNewUser(dummy);
                          }}>X</button>
                        )}
                        <button className={styles.btn} onClick={() => {
                          dummy.restrictions.resources.push("");
                          setNewUser(dummy);
                        }}>+</button>
                      </div>
                    )}
                  </div>
                )
              })
              }
            </div>
          </div>
        </div>
        <br />
        <button onClick={() => {
          setCreateU(false);
          console.log("dummyyyy -> ", dummy);
          addUser(dummy);
        }}>Create</button>
        <button onClick={() => {
          setCreateU(false);
        }}>Cancel</button>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <p className={styles.title}>Users</p>
      {activeUser === "" && !createU && showUsers()}
      {activeUser !== "" && !createU && showUser(users.findIndex((u) => { return u.id === activeUser; }))}
      {activeUser === "" && createU && createUser()}
      {activeUser === "" && !createU && (
        <button className={styles.buttons} onClick={() => {
          setCreateU(true);
        }}>Create User</button>
      )}
    </div>
  )
}