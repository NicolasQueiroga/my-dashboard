import styles from '../styles/components/Controller.module.css';


export default function Controller({ page, setPage }: ({ page: number, setPage: Function })) {
    return (
        <div className={styles.controller}>
            <div className={styles.controllerButtons}>
                <button onClick={() => setPage(0)}>Security Groups</button>
                <button onClick={() => setPage(1)}>Instances</button>
                <button onClick={() => setPage(2)}>User Groups</button>
                <button onClick={() => setPage(3)}>Users</button>
                <button onClick={() => setPage(4)}>Resume</button>
            </div>
            <div className={styles.footer}>
                {page > 0 && (<button className={styles.btn} onClick={() => setPage(page - 1)} >Previous</button>)}
                <p className={styles.page}>{page} / 4</p>
                {page < 4 && (<button className={styles.btn} onClick={() => setPage(page + 1)} >Next</button>)}
            </div>
        </div>
    )
}
