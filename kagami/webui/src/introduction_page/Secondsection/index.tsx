import{FC} from 'react';
import styles from './styles.module.scss';
import logo from '../../picture/logo.jpg';
import name from '../../picture/word.jpg';

const Secondsection:FC = () => {
    return(
        <div className={styles.parentContainer}>
            <div className={styles.logo}>
                <img src={logo} alt='logo'/>
            </div>
            <div className={styles.name}>
                <img src={name} alt='name' />
            </div>
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    //value={query}
                   // onChange={(e) => setQuery(e.target.value)}
                    placeholder="Searhing for Mirror...."
                />
                <button className={styles.searchButton} >
                    Search
                </button>
                </div>

        </div>
    )
}
export default Secondsection;