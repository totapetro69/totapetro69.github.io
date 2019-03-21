var base_url ="https://api.football-data.org/v2/";
var api_token = 'dca0373b8b944f46830f44f5ad17b078'
var league1 = 2002;
var league2 = 2015;
var standing_league1 = `${base_url}competitions/${league1}/standings`;
var standing_league2 = `${base_url}competitions/${league2}/standings`;
var team_endpoint = `${base_url}teams/`;

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': api_token
    }
  });
}

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

//Blok kode untuk mengambil standing/klasemen
function getStandingLeague(leagues) {
  if ('caches' in window) {
    caches.match(leagues).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          viewStanding(data);
        });
      }
    });
  }

  fetchApi(leagues)
      .then(status)
      .then(json)
      .then(function(data) {
        viewStanding(data);
      })
      .catch(error);
}

function viewStanding(data){
  var standingHTML = '';

  data.standings[0].table.forEach(function(stand) {
    standingHTML += `
                <td class="center">${stand.position}</td>
                <td>
                    <a href="../teams.html?id=${stand.team.id}">
                    <p class="hide-on-small-only">
                    <img class = "show-on-medium-and-up show-on-medium-and-down" src=${stand.team.crestUrl}  alt="logo" style="float:left;width:22px;height:22px;margin-right:20px">
                    ${stand.team.name}
                    </p>
                    <p class="hide-on-med-and-up">
                        <img src=${stand.team.crestUrl}  alt="logo" style="float:left;width:22px;height:22px;margin-right:20px">
                    </p>
                    </a>
                </td>
                <td class="center">${stand.playedGames}</td>
                <td class="center">${stand.won}</td>
                <td class="center">${stand.draw}</td>
                <td class="center">${stand.lost}</td>
                <td class="center">${stand.goalsFor}</td>
                <td class="center">${stand.goalsAgainst}</td>
                <td class="center">${stand.goalDifference}</td>
                <td class="center">${stand.points}</td>
              </tr>
          `;
  });
  document.getElementById("standing").innerHTML = standingHTML;
}

function getTeamSquad(squad) {
  if ('caches' in window) {
    caches.match(squad).then(function (response) {
      if (response) {
        response.json().then(function (data) {
          viewTeam(data);
        });
      }
    });
  }
  fetchApi(squad)
      .then(status)
      .then(json)
      .then(function(data) {
        viewTeam(data);

        var bFav = document.getElementById("bFav");
        var bDel = document.getElementById("bDel");

        checkFavoriteData(data.id).then((msg) => {
          bFav.style.display = "none";
          bDel.style.display = "block";
        }).catch((msg) => {
          bFav.style.display = "block";
          bDel.style.display = "none";
        });
        bFav.onclick = function () {
          addToFavorite(data);
          bFav.style.display = "none";
          bDel.style.display = "block";
        };
        bDel.onclick = function () {
          deleteFromFavorite(data.id);
          bFav.style.display = "block";
          bDel.style.display = "none";
        }
      })
      .catch(error);
}

function viewTeam(data){
  var teamsHTML = '';

  teamsHTML += `
        <div class="row">
            <div class="col s12 m12">
                <div class="card">
                    <div class="card-content">
                        <div style="text-align: center">
                            <img src=${data.crestUrl.replace(/^http:\/\//i, 'https://')} align="center" width="150" height="150" vspace="25" >
                            <h3>${data.name}</h3>
                        </div>
                    </div>
                    
                      <div><center>
                             <button class="btn red waves-effect" id="bDel">Delete from My Favorite</button>
                             <button class="btn blue waves-effect" id="bFav">Add to My Favorite</button>
                          </center>
                          <br>
                      </div>
                  </div>
                  
                  <div class="card">
                    <div class="card-content">
                        <table class="responsive-table highlight" >
                            <thead class="blue lighten-1" style="font-style: oblique; text-align: center">
                            <tr>
                                <td class="center">Address</td>
                                <td class="center">Phone</td>
                                <td class="center">Founded</td>
                                <td class="center">Email</td>
                                <td class="center">Club Colors</td>
                             </tr>
                            </thead>
                            <tbody>
                                <tr class="blue lighten-5">
                                  <td class="center">${data.address}</td>
                                  <td class="center">${data.phone}</td>
                                  <td class="center">${data.founded}</td>
                                  <td class="center">${data.email}</td>
                                  <td class="center">${data.clubColors}</td>
                                </tr>
                            </tbody>
                           </table>
                    </div>
                  </div>     
                 `;

  teamsHTML += `
        <div class="card">
            <div class="card-content">
              <h4>List of Squad</h4>
              <table class="responsive-table highlight" >
                <thead class="blue lighten-1" style="font-style: oblique; text-align: center">
                  <tr>
                    <td class="center">Name</td>
                    <td class="center">DOB</td>
                    <td class="center">Position</td>
                    <td class="center">Nationality</td>
                  </tr>
                </thead>
                <tbody>`;

  data.squad.forEach(function(squad) {
    teamsHTML += `
              <tr class="blue lighten-5">
                <td class="center">${squad.name}</td>
                <td class="center">${squad.position}</td>
                <td class="center">${squad.dateOfBirth}</td>
                <td class="center">${squad.nationality}</td>
              </tr>
          `;
  });

  teamsHTML += `</tbody></table>
                    </div>
                  </div>
              </div>
          </div>`;

  document.getElementById("body-content").innerHTML = teamsHTML;
}

function getMyFavoriteTeam() {
  var dbFav = getFavoriteData();
  dbFav.then(function (data) {

    var favoriteHtml = '';
    data.forEach(function(club) {
      favoriteHtml +=`
            <div class="center">
              <img src=${club.crestUrl.replace(/^http:\/\//i, 'https://')} width="200" class="responsive-img">
              <h5><a href="../teams.html?id=${club.id}"><p style="font-style: oblique">${club.name}</p></a></h5>
              <h5 style="font-style: inherit">----------------------------------------------------------------</h5>
              <br>
            </div>`;
    });
    document.getElementById("myfavorite").innerHTML = favoriteHtml;
  });

}