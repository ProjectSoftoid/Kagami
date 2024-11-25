import{FC} from 'react';
import styles from './styles.module.scss';

const Thirdsection:FC = () => {
    return(
        <div className={styles.Container}>
        <div className={styles.thirdSection}>
            <span className={styles.blog}>blog</span>
            <span className={styles.blog}>docs</span>
            <span className={styles.blog}>github</span>
            <span className={styles.blog}>微信公眾號</span>
            <span className={styles.blog}>聯繫方式</span>
        </div>
        </div>
    )
}
export default Thirdsection;