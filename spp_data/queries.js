const SPP_QUERY_GET_RATINGS = `
query GetTeacherRatings(
    $id: ID!
  ) {
    node(id: $id) {
      ... on Teacher {
          firstName
          lastName
          avgRating
          avgDifficulty
          ratings {
              edges {
                  node {
                      class
                      helpfulRating
                      clarityRating
                      difficultyRating
                  }
              }
          }
      }
    }
  }
`