# Voting-System-Middleware

Aktualnie mock middleware dla systemu głosowania elektronicznego.

1.Uruchomienie

 - Aplikacja wymaga Node.js
 - W terminalu, będąc w folderze z projektem:
 - `npm install`
 - `npm start`

2.Endpointy

|URL  |Method | Header  |Body  |Description  |
| --- | --- | --- | --- | --- |
|/vm/getVote/{tokenId}  | GET |-  | - | Get voter's vote. |
| /vm/vote | POST |Content-Type: application/json  |`{ "tokenId": "123", "candidateId": "345"  }`  | Vote for candidate. |
| /vm/getCandidates |GET  | - |  -| Get available candidates. |
| /vm/getResultsByCandidates |GET  | - |  -| Get results by Candidates. |
| /vm/getResultsByParties |GET  | - |  -| Get results by Party. |
| /vm/beginVoting |POST  | - |  -| Start Voting. |
| /vm/endVoting |POST  | - |  -| End Voting. |
