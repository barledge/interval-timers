import Header from '../ui/Header'
import { logout } from '../../actions'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { history } from '../../store/store'
// import * as router from 'connected-react-router'


const mapStateToProps = ({ app }, props) => {
	const { loggedIn } = app
	return {
		loggedIn,
		history
	}
}

const mapDispatchToProps = dispatch =>
	({
		logout() {
			dispatch(
				logout()
			)
		},
		push(path) {
			dispatch(
				push(path)
			)
		}
	})

export default connect(mapStateToProps)(Header)
