import styles from '../../styles/SecurityGroups.module.css'
import { useEffect, useState } from "react";

let dummy = {
  id: "",
  name: "",
  description: "",
  ingress: [
    {
      protocol: "",
      from_port: "",
      to_port: "",
      cidr_blocks: [""],
    },
  ],
};


export default function SecurityGroups({ json, setJson, page, setPage }: ({ json: JsonProps, setJson: Function, page: number, setPage: Function })) {
  const [securityGroups, setSecurityGroups] = useState<Array<SecurityGroupProps>>(json.security_groups);
  const [newSg, setNewSg] = useState<SecurityGroupProps>(dummy);
  useEffect(() => {
    setSecurityGroups(json.security_groups);
  }, [json.security_groups]);

  const [createSg, setCreateSg] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>("");

  function addSecurityGroup(data: SecurityGroupProps) {
    let newJson = { ...json };
    let newSg = { ...data };
    newSg.id = (json.security_groups.length + 1).toString();
    newJson.security_groups.push(newSg);
    setJson(newJson);
  }

  function updateSecurityGroup(data: SecurityGroupProps) {
    let newJson = { ...json };
    newJson.security_groups.map((sg) => {
      if (sg.id === data.id) {
        sg.name = data.name;
        sg.description = data.description;
        sg.ingress = data.ingress;
      }
    });
    setJson(newJson);
  }

  function deleteSecurityGroup(id: string) {
    const newJson = { ...json };
    newJson.security_groups = newJson.security_groups.filter((sg) => sg.id != id);
    newJson.instances.map((instance) => {
      instance.security_groups_ids = instance.security_groups_ids.filter((sg) => sg != id);
    });
    if (newJson.instances.length > 0) {
      newJson.instances = newJson.instances.filter((instance) => instance.security_groups_ids.length > 0);
    }
    setJson(newJson);
  }

  function createSecurityGroup() {
    dummy = { ...newSg };
    return (
      <div className={styles.securityGroupFocus}>
        <input type="text" placeholder="Name" defaultValue={newSg.name} onChange={(e) => (dummy.name = e.target.value)} />
        <input type="text" placeholder="Description" defaultValue={newSg.description} onChange={(e) => (dummy.description = e.target.value)} />
        <div className={styles.ingress}>
          {newSg.ingress.map((ingress, index) => (
            <div key={index} className={styles.ingressItem}>
              <input type="text" placeholder="Protocol" defaultValue={ingress.protocol} onChange={(e) => (dummy.ingress[index].protocol = e.target.value)} />
              <input type="text" placeholder="From Port" defaultValue={ingress.from_port} onChange={(e) => (dummy.ingress[index].from_port = e.target.value)} />
              <input type="text" placeholder="To Port" defaultValue={ingress.to_port} onChange={(e) => (dummy.ingress[index].to_port = e.target.value)} />
              {ingress.cidr_blocks.map((cidr_block, k) => (
                <div key={k} className={styles.cidr_block}>
                  <input type="text" placeholder="CIDR Block" defaultValue={cidr_block} onChange={(e) => (dummy.ingress[index].cidr_blocks[k] = e.target.value)} />
                  {ingress.cidr_blocks.length - 1 === k && ingress.cidr_blocks.length > 1 &&
                    <button className={styles.deleteBtn} onClick={() => {
                      dummy.ingress[index].cidr_blocks.splice(k, 1);
                      setNewSg(dummy);
                    }}>X</button>
                  }
                  {ingress.cidr_blocks.length - 1 === k &&
                    <button className={styles.addBtn} onClick={() => {
                      dummy.ingress[index].cidr_blocks.push("");
                      setNewSg(dummy);
                    }}>+</button>
                  }
                </div>
              ))}
              {newSg.ingress.length - 1 === index && newSg.ingress.length > 1 && <button className={styles.deleteBtn} onClick={() => {
                dummy.ingress.splice(index, 1);
                setNewSg(dummy);
              }}>X</button>}
              {newSg.ingress.length - 1 === index && <button className={styles.addBtn} onClick={() => {
                dummy.ingress.push({
                  protocol: "",
                  from_port: "",
                  to_port: "",
                  cidr_blocks: [""],
                });
                setNewSg(dummy);
              }}>+</button>}
            </div>
          ))}
        </div>
        <button
          onClick={() => {
            addSecurityGroup(dummy);
            setCreateSg(false);
          }}
        >
          Create
        </button>
        <button
          onClick={() => {
            setCreateSg(false);
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  function showSecurityGroups() {
    return (
      <div className={styles.securityGroups}>
        {securityGroups.map((securityGroup) => (
          <div className={styles.securityGroup} key={securityGroup.id}>
            <p className={styles.securityGroupName} onClick={() => setActiveId(securityGroup.id)}>{securityGroup.name}</p>
            <p className={styles.securityGroupDescription}>{securityGroup.description}</p>
            <button className={styles.deleteBtn} onClick={() => deleteSecurityGroup(securityGroup.id)}>Delete</button>
          </div>
        ))}
      </div>
    );
  }

  function showSecurityGroup(index: number) {
    dummy = { ...securityGroups[index] };
    return (
      <div className={styles.securityGroupFocus}>
        <input type="text" placeholder="Name" defaultValue={securityGroups[index].name} onChange={(e) => { dummy.name = e.target.value }} />
        <input type="text" placeholder="Description" defaultValue={securityGroups[index].description} onChange={(e) => { dummy.description = e.target.value }} />
        {securityGroups[index].ingress.map((ingress, ingressIndex) => (
          <div className={styles.ingress} key={ingressIndex}>
            <input type="text" placeholder="Protocol" defaultValue={ingress.protocol} onChange={(e) => { dummy.ingress[ingressIndex].protocol = e.target.value }} />
            <input type="text" placeholder="From Port" defaultValue={ingress.from_port} onChange={(e) => { dummy.ingress[ingressIndex].from_port = e.target.value }} />
            <input type="text" placeholder="To Port" defaultValue={ingress.to_port} onChange={(e) => { dummy.ingress[ingressIndex].to_port = e.target.value }} />
            {ingress.cidr_blocks.map((cidr_block, cidr_blockIndex) => (
              <div className={styles.cidr_block} key={cidr_blockIndex}>
                <input type="text" placeholder="CIDR Block" defaultValue={cidr_block} onChange={(e) => { dummy.ingress[ingressIndex].cidr_blocks[cidr_blockIndex] = e.target.value }} />
                {ingress.cidr_blocks.length - 1 === cidr_blockIndex && ingress.cidr_blocks.length > 1 && <button className={styles.deleteBtn} onClick={() => {
                  dummy.ingress[ingressIndex].cidr_blocks.splice(cidr_blockIndex, 1)
                  updateSecurityGroup(dummy);
                }}>X</button>}
                {ingress.cidr_blocks.length - 1 === cidr_blockIndex && <button className={styles.addBtn} onClick={() => {
                  dummy.ingress[ingressIndex].cidr_blocks.push("");
                  updateSecurityGroup(dummy);
                }}>+</button>}
              </div>
            ))}
            {securityGroups[index].ingress.length - 1 === ingressIndex && securityGroups[index].ingress.length > 1 && <button className={styles.deleteBtn} onClick={() => {
              dummy.ingress.splice(ingressIndex, 1)
              updateSecurityGroup(dummy);
            }}>X</button>}
            {securityGroups[index].ingress.length - 1 === ingressIndex && <button className={styles.addBtn} onClick={() => {
              dummy.ingress.push({
                protocol: "",
                from_port: "",
                to_port: "",
                cidr_blocks: [""],
              });
              updateSecurityGroup(dummy);
            }}>+</button>}
          </div>
        ))}
        <button className={styles.updateBtn} onClick={() => {
          console.log(dummy)
          updateSecurityGroup(dummy);
          setActiveId("")
        }}>Update</button>
      </div>
    );
  }


  return (
    <div className={styles.container}>
      <p className={styles.title}>Security Groups</p>
      {activeId === "" && !createSg && showSecurityGroups()}
      {activeId !== "" && !createSg && showSecurityGroup(securityGroups.findIndex((securityGroup) => securityGroup.id === activeId))}
      {createSg && createSecurityGroup()}
      {!createSg && activeId === "" && <button className={styles.addBtn} onClick={() => setCreateSg(true)}>Create Security Group</button>}
      <div className={styles.pageBtns}>
        <p className={styles.page}>{page} / 4</p>
        <button onClick={() => setPage(page + 1)} >Next</button>
      </div>
    </div>
  )
}