import styles from '../styles/components/Instances.module.css'
import { useState, useEffect } from "react";


const ami_reference = {
  "us-east-1": "ami-00a0e0b890ae17d65",
  "us-east-2": "ami-0b4577d77dac11b84",
  "us-west-1": "ami-07ca31583160e0a93",
  "us-west-2": "ami-0cc5d32378afd3b57",
  "sa-east-1": "ami-084fadaa5d7882916",
  "eu-west-1": "ami-082bec92abb02aba4",
  "eu-west-2": "ami-0f0741503c767a317",
  "eu-west-3": "ami-03a5d4b9a3dba6ebe",
  "eu-central-1": "ami-0a474432ef48429a7",
  "ap-southeast-1": "ami-0ec559e18e8ed6466",
  "ap-southeast-2": "ami-0bb85ffded6e32670",
  "ap-northeast-1": "ami-04705b95f49850f5e",
  "ap-northeast-2": "ami-0cf362b88b0395b94",
  "ap-northeast-3": "ami-0cf362b88b0395b94",
  "ca-central-1": "ami-0191b23c592e9a01b",
  "cn-north-1": "ami-0764541358866f84e",
  "cn-northwest-1": "ami-02441dea73a15a612",
  "us-gov-west-1": "ami-02642d561d662175f",
  "us-gov-east-1": "ami-01c308292da9fe7f5"
}


const instanceTypeList = [
  "t2.micro",
  "t2.small",
  "t2.medium",
];


export default function Instances({ json, setJson }: ({ json: JsonProps, setJson: Function })) {
  const [instances, setInstances] = useState(json.instances);
  const [createI, setCreateI] = useState(false);
  const [activeInstance, setActiveInstance] = useState("");


  let dummy: InstanceProps = {
    name: "",
    ami: "",
    instance_type: "",
    region: "",
    security_groups_ids: []
  }


  useEffect(() => {
    setInstances(json.instances);
  }, [json.instances]);

  function deleteInstance(name: string) {
    const newJson = { ...json };
    newJson.instances = newJson.instances.filter((instance) => instance.name != name);
    setJson(newJson);
  }

  function addInstance() {
    let newJson = { ...json };
    newJson.instances.push(dummy);
    setJson(newJson);
  }

  function updateInstance() {
    let newJson = { ...json };
    newJson.instances = newJson.instances.filter((instance) => instance.name != activeInstance);
    newJson.instances.push(dummy);
    setJson(newJson);
    setActiveInstance("");
  }

  function showInstances() {
    return instances.length === 0 ? (
      <div className={styles.noI}>
        <p>No Instances</p>
      </div>
    ) : (
      <div className={styles.instances}>
        {instances.map((instance, index) => {
          return (
            <div key={index} className={styles.instance} onClick={() => { setActiveInstance(instance.name) }}>
              <p className={styles.instanceName}>{instance.name}</p>
              <p className={styles.instanceRegion}>{instance.region}</p>
              <p className={styles.instanceType}>{instance.instance_type}</p>
              <p className={styles.instanceAMI}>{(ami_reference as any)[instance.region]}</p>
              <div className={styles.instanceSecurityGroups}>
                {instance.security_groups_ids.map((sg, k) => {
                  let sgName = "";
                  json.security_groups.forEach((secGroup) => {
                    if (secGroup.id == sg)
                      sgName = secGroup.name;
                  });
                  return (
                    <div key={k} className={styles.instanceSecurityGroup}>
                      <p>{sgName}</p>
                    </div>
                  )
                })}
              </div>
              <div className={styles.deleteBtn}>
                <button onClick={() => {
                  deleteInstance(instance.name);
                }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function showInstance(index: number) {
    dummy = { ...instances[index] };
    return (
      <div className={styles.instanceContainer}>
        <input type="text" placeholder="Name" defaultValue={dummy.name} onChange={(e) => { dummy.name = e.target.value }} />
        <select defaultValue={dummy.region} onChange={(e) => {
          dummy.region = e.target.value
          dummy.ami = (ami_reference as any)[dummy.region];
        }} >
          {Object.keys(ami_reference).map((region, index) =>
          (
            <option key={index} defaultValue={dummy.region}>{region}</option>
          ))}
        </select>
        <select value={dummy.instance_type} onChange={(e) => { dummy.instance_type = e.target.value }}>
          {instanceTypeList.map((instanceType, index) => {
            return (
              <option key={index} defaultValue={instanceType}>{instanceType}</option>
            )
          })}
        </select>
        <div className={styles.instanceSecurityGroups}>
          {json.security_groups.map((sg, k) => {
            return (
              <div key={k} className={styles.instanceSecurityGroup}>
                <input type="checkbox" defaultChecked={dummy.security_groups_ids.includes(sg.id)} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.security_groups_ids.push(sg.id);
                  } else {
                    dummy.security_groups_ids = dummy.security_groups_ids.filter((id) => id != sg.id);
                  }
                }} />
                <label>{sg.name}</label>
              </div>
            )
          })}
        </div>
        <button className={styles.instanceButton} onClick={() => {
          updateInstance();
        }}>Update</button>
      </div>

    )
  }

  function createInstance() {
    return (
      <div className={styles.createInstance}>
        <h2>Create Instance</h2>
        <input type="text" name="name" placeholder="Instance Name" onChange={(e) => {
          dummy.name = e.target.value
        }} />
        <select name="region" onChange={(e) => {
          dummy.region = e.target.value
          dummy.ami = (ami_reference as any)[dummy.region];
        }}>
          <option value="">Select Region</option>
          {Object.keys(ami_reference).map((region, index) =>
          (
            <option key={index} value={region}>{region}</option>
          ))}
        </select>
        <select name="instance_type" onChange={(e) => {
          dummy.instance_type = e.target.value
        }}>
          <option value="">Select Instance Type</option>
          {instanceTypeList.map((instanceType, index) => {
            return (
              <option key={index} value={instanceType}>{instanceType}</option>
            )
          })}
        </select>

        <div className={styles.sgCheckbox}>
          {json.security_groups.map((sg, index) => {
            return (
              <div className={styles.sgItems} key={index}>
                <input type="checkbox" name="sg" value={sg.id} onChange={(e) => {
                  if (e.target.checked) {
                    dummy.security_groups_ids.push(e.target.value);
                  } else {
                    dummy.security_groups_ids = dummy.security_groups_ids.filter((sg) => {
                      return sg != e.target.value;
                    })
                  }
                }} />
                <label>{sg.name}</label>
              </div>
            )
          })}
        </div>



        <div className={styles.buttons}>
          <button onClick={() => {
            addInstance();
            setCreateI(false);
          }}>Create</button>
          <button onClick={() => {
            setCreateI(false);
          }}>Cancel</button>
        </div>
      </div>
    )
  }



  return (
    <div className={styles.container}>
      <p className={styles.title}>Instances</p>
      {activeInstance === "" && !createI && showInstances()}
      {activeInstance !== "" && showInstance(instances.findIndex((instance) => { return instance.name == activeInstance }))}
      {createI && activeInstance === "" && createInstance()}
      {!createI && activeInstance === "" && (
        <button className={styles.buttons} onClick={() => {
          setCreateI(true);
        }}>Create Instance</button>
      )}
    </div>
  )
}