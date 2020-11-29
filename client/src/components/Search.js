import React, { Component } from 'react';
import ProfilePreview from './ProfilePreview';
import '../styles/Search.css';
import { Link } from 'react-router-dom';

class Search extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: '',
      noUsers: false,
      currentlyLoadingSearch: false,
      usersResult: []
    }
  }

  componentDidMount() {
    this.checkDarkMode()
  }

  checkDarkMode = () => {
    if (localStorage.getItem('darkMode') === 'true') {
      const searchBar = document.getElementById('searchBar')
      const searchResults = document.getElementById('searchResults')
      searchBar.style.backgroundColor = '#999999'
      searchResults.style.backgroundColor = '#999999'
    }
  }

  // handle page click when using search (hide search results)
  pageClick = async (event) => {
      let targetElement = event.target || event.srcElement;
      // console.log(targetElement.id);
      // console.log(targetElement);
      if (
        targetElement.id !== "profilePreviewName" &&
        targetElement.id !== "profilePreviewDetails" &&
        targetElement.id !== "searchResultPic" &&
        targetElement.id !== "searchBar" &&
        targetElement.id !== "profilePreview"
      ) {
        this.setState({
          noUsers: false,
          currentlyLoadingSearch: false,
          usersResult: []
        })
        this.toggleResult()
      }
  }

  // determines which element will be displayed
  // between results, no users found, or loading
  toggleResult = () => {
    const searchResults = document.getElementById("searchResults");
    const searchResultsNone = document.getElementById("searchResultsNone");
    const currentlyLoading = document.getElementById("currentlyLoading");

    if (this.state.currentlyLoadingSearch) {
      searchResults.style.display = 'none'
      searchResultsNone.style.display = 'none'
      currentlyLoading.style.display = 'block'
    } else if (this.state.noUsers) {
      searchResults.style.display = 'none'
      searchResultsNone.style.display = 'block'
      currentlyLoading.style.display = 'none'
    } else if (this.state.usersResult.length > 0) {
      searchResults.style.display = 'block'
      searchResultsNone.style.display = 'none'
      currentlyLoading.style.display = 'none'
    } else {
      searchResults.style.display = 'none'
      searchResultsNone.style.display = 'none'
      currentlyLoading.style.display = 'none'
    }
  }

  searchUsers = async (userToSearch) => {
    //userToSearch.preventDefault()
    const query = userToSearch.target.value
    // verification of no funky characters (prevent useless fetch)
    var re = /^\w+$/;
    if (!re.test(query)) {
      this.setState({
        noUsers: true,
        currentlyLoadingSearch: false,
        usersResult: []
       })
    } else {
      window.addEventListener('mousedown', this.pageClick, false);
      let searchUser = userToSearch.target.value
      this.setState({
        user: searchUser,
        currentlyLoadingSearch: true,
        noUsers: false,
        usersResult: []
      })
      // only request if search field has a value
      if (searchUser.length > 0) {
        const response = await fetch(
          '/profile/searchUsers/' + searchUser
        )
        .catch((error) => {
          console.log(error)
        })
        const body = await response.text()
        const parsedBody = JSON.parse(body)
        // if empty result, let user know
        if (parsedBody.length < 1) {
          this.setState({
            noUsers: true,
            currentlyLoadingSearch: false,
            usersResult: []
           })
        } else {
          this.setState({
            noUsers: false,
            currentlyLoadingSearch: false,
            usersResult: parsedBody
          })
        }
      } else {
        // no value in search field, make sure no result
        this.setState({
          currentlyLoadingSearch: false,
          noUsers: false,
          usersResult: [],
        })
      }
      this.toggleResult()
    }
  }

  // hide the search results (clicked on a profile to view)
  clickedSearchResultProfile = () => {
    this.setState({
      noUsers: false,
      currentlyLoadingSearch: false,
      usersResult: []
    })
    this.toggleResult()
  }

  render() {
    return (
      <div>
        <input
          id="searchBar"
          className="form-control"
          type="search"
          placeholder="Search Users"
          aria-label="Search"
          onChange={(searchTerm) => this.searchUsers(searchTerm)}
        />

        <div id="searchResults">
          {this.state.usersResult.map((user, i) => (
            <Link
              id="searchProfileResultLink"
              key={i}
              to={"/profile/" + user.username}
              onClick={this.clickedSearchResultProfile}
              style={{color: 'black'}}
            >
              <ProfilePreview
                username={user.username}
                profileImage={user.profileImage}
                description={user.description}
                isProfilePicNsfw={user.profilePicNsfw}
                key={i}
              />
            </Link>
          ))}
        </div>

        <div id="searchResultsNone">
          No users found.
        </div>

        <div id="currentlyLoading">
          Loading...
        </div>
      </div>
    )
  }
}

export default Search;
