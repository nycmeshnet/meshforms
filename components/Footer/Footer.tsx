// import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '@/res/logo.svg'

import styles from './Footer.module.scss'

export function Footer() {
    return <>
    <footer>
      <div className={styles.footer}>
        <div className={styles.row}>
          <div className={styles.column}>
            <div className={styles.logoAndText}>
                <img className={styles.logo} src={logo.src} height={512} width={512} alt="" />
                <strong>
                    NYC Mesh
                </strong>
            </div>
          </div>
          <div className={styles.column}>
            <h3>Community</h3>
            <ul >
              <li>
                <a href="https://slack.nycmesh.net" className="text-muted">Slack</a>
              </li>
              <li>
                <a href="https://meetup.com/nycmesh" className="text-muted"
                  >Meetup</a
                >
              </li>
              <li>
                <a href="https://www.nycmesh.net/volunteer" className="text-muted"
                  >Volunteer</a
                >
              </li>
              <li>
                <a
                  href="https://us9.campaign-archive.com/home/?u=cf667149616fd293afa115f5a&amp;id=ebe72854f3"
                  className="text-muted"
                  >Newsletter</a
                >
              </li>
              <li>
                <a href="https://www.nycmesh.net/blog" className="text-muted"
                  >Blog</a
                >
              </li>
              <li>
                <a href="https://www.nycmesh.net/coc" className="text-muted"
                  >Code of Conduct</a
                >
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Network</h3>
            <ul>
              <li>
                <a href="https://stats.nycmesh.net" className="text-muted">Stats</a>
              </li>
              <li>
                <a
                  href="https://docs.nycmesh.net/networking/peering/"
                  className="text-muted"
                  >Peering</a
                >
              </li>
              <li>
                <a href="https://www.nycmesh.net/sponsors" className="text-muted"
                  >Sponsors</a
                >
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Resources</h3>
            <ul>
              <li>
                <a href="https://www.nycmesh.net/faq" className="text-muted">FAQ</a>
              </li>
              <li>
                <a href="https://docs.nycmesh.net" className="text-muted" target="_"
                  >Docs</a
                >
              </li>
              <li>
                <a href="https://los.nycmesh.net" className="text-muted" target="_"
                  >Line of Sight</a
                >
              </li>
              <li>
                <a
                  href="https://www.nycmesh.net/presentations"
                  className="text-muted"
                  >Presentations</a
                >
              </li>
              <li>
                <a
                  href="https://docs.nycmesh.net/organization/outreach/"
                  className="text-muted"
                  target="_"
                  >Outreach</a
                >
              </li>
              <li>
                <a
                  href="https://www.nycmesh.net/pay"
                  className="text-muted"
                  target="_"
                  >Install Payment</a
                >
              </li>
              <li>
                <a
                  href="https://github.com/WillNilges/cursed-status-page"
                  className="text-muted"
                  >GitHub</a
                >
              </li>
            </ul>
          </div>
          <div className={styles.column}>
            <h3>Social</h3>
            <ul>
              <li>
                <a href="https://mastodon.nycmesh.net/@mesh" className="text-muted"
                  >Mastodon</a
                >
              </li>
              <li>
                <a
                  href="https://bsky.app/profile/nycmesh.bsky.social"
                  className="text-muted"
                  >Bluesky</a
                >
              </li>
              <li>
                <a href="https://www.threads.net/@nycmesh" className="text-muted"
                  >Threads</a
                >
              </li>
              <li>
                <a href="https://www.youtube.com/@nycmesh" className="text-muted"
                  >YouTube</a
                >
              </li>
              <li>
                <a href="https://www.facebook.com/nycmesh" className="text-muted"
                  >Facebook</a
                >
              </li>
              <li>
                <a href="https://www.instagram.com/nycmesh" className="text-muted"
                  >Instagram</a
                >
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
    </>

}
