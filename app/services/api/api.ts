import { ApisauceInstance, create } from "apisauce"
import Config from "../../config"
import type { ApiConfig } from "./api.types"
import type { LevelsResponse, LoginResponse, User } from "../../apiResponseTypes";

/**
 * Configuring the apisauce instance.
 */
export const DEFAULT_API_CONFIG: ApiConfig = {
  url: Config.API_URL,
  timeout: 10000,
}

/**
 * Manages all requests to the API. You can use this class to build out
 * various requests that you need to call from your backend API.
 */
export class Api {
  apisauce: ApisauceInstance
  config: ApiConfig

  /**
   * Set up our API instance. Keep this lightweight!
   */
  constructor(config: ApiConfig = DEFAULT_API_CONFIG) {
    this.config = config
    this.apisauce = create({
      baseURL: this.config.url,
      timeout: this.config.timeout,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })

    this.apisauce.addResponseTransform((response) => response?.data)
  }

  async updatePreferences(
    enableHaptics: boolean,
    enableSounds: boolean,
    enableNotification: boolean,
  ) {
    const mutation = `
      mutation UpdatePreferences($input: UserPreferencesInput!) {
        updatePreferences(input: $input) {
          id
          enable_haptics
          enable_sounds
          enable_notification
        }
      }
    `

    const response = await this.sendRequest(mutation, {
      input: {
        enableHaptics: enableHaptics,
        enableSounds: enableSounds,
        enableNotification: enableNotification,
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data
  }

  /**
   * Set the Authorization header with the provided token.
   * @param token The token to be set as Bearer in the Authorization header
   */
  setToken(token: string) {
    if (token === null) {
      this.apisauce.deleteHeader("Authorization")
      console.log("Authorization Token removed")
    } else {
      this.apisauce.setHeader("Authorization", `Bearer ${token}`)
      console.log("Authorization Token added")
    }
  }

  /**
   * Creates a new account
   *
   * @param email The user's email address
   * @param password The user's password
   * @returns The created account data or an error
   */
  async createAccount(email: string, password: string, dateOfBirth: string) {
    const mutation = `
      mutation Register($username: String!, $email: String!, $password: String!, $dateOfBirth: Date!) {
        register(
          input: {
            username: $username
            email: $email
            password: $password
            profile: { dateOfBirth: $dateOfBirth }
          }
        ) {
          tokens {
            accessToken
            expiresIn
            refreshToken
            tokenType
          }
          status
        }
      }
    `

    const response = await this.sendRequest(mutation, {
      username: email,
      email,
      password,
      dateOfBirth,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data
  }

  /**
   * Verifies an account
   *
   * @param token Token recieved from the deeplink
   * @returns The data or an error
   */
    async verifyEmail(token: string) {
      const mutation = `
        mutation VerifyEmail($token: String!) {
            verifyEmail(input: { token: $token }) {
                tokens {
                    accessToken
                    refreshToken
                    expiresIn
                    tokenType
                    user {
                        created_at
                        email
                        id
                        updated_at
                        username
                        preferences {
                            enable_haptics
                            enable_notification
                            enable_sounds
                            id
                        }
                    }
                }
                status
            }
        }
      `
  
      const response = await this.sendRequest(mutation, {
        token
      })
  
      if (!response.ok) {
        throw new Error(`API error: ${response.problem}`)
      }
  
      if (response.errors) {
        throw new Error(`GraphQL error: ${response.errors[0].message}`)
      }
  
      return response.data
    }

  

  async login(username: string, password: string) {
    const mutation = `
      mutation Login($username: String!, $password: String!) {
        login(input: { username: $username, password: $password }) {
          tokens {
            accessToken
            expiresIn
            refreshToken
            tokenType
            user {
              created_at
              email
              id
              updated_at
              username
            children {
              data {
                date_of_birth
                firstname
                lastname
                id
                character {
                  name
                  skin {
                    gender
                    hair_style
                    color
                    outfit
                  }
                  }
                }	
              }
              preferences {
                enable_haptics
                enable_notification
                enable_sounds
                id
              }
            }
          }
          status
        }
      }
   `

    const response = await this.sendRequest(mutation, {
      username: username,
      password: password,
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    console.log("response", response.data.data)
    return response.data.data as LoginResponse;
  }

  async forgotPassword(email: string) {
    const mutation = `
      mutation ForgotPassword($email: String!) {
        forgotPassword(input: { email: $email }) {
          message
          status
        }
      }
    `

    const response = await this.sendRequest(mutation, { email })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data
  }

  async updateForgottenPassword(email: string, token: string, password: string, confirmPassword: string) {
    const mutation = `
      mutation UpdateForgottenPassword(
        $email: String!,
        $token: String!,
        $password: String!,
        $confirmPassword: String!
      ) {
        updateForgottenPassword(
          input: {
            email: $email,
            token: $token,
            password: $password,
            confirmPassword: $confirmPassword
          }
        ) {
          status
          message
        }
      }
    `

    const response = await this.sendRequest(mutation, { email, token, password, confirmPassword })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data
  }

  async resendVerificationEmail(userId: string) {
    const mutation = `
    mutation ResendVerificationEmail($userId: ID!) {
      resendVerificationEmail(userId: $userId) {
        status
        message
      }
    }
  `

    const response = await this.sendRequest(mutation, { userId })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data
  }

  async refreshToken(refreshToken: string) {
    const mutation = `
      mutation RefreshToken($input: RefreshTokenInput!) {
        refreshToken(input: $input) {
          accessToken
          refreshToken
          expiresIn
          tokenType
        }
      }
    `

    const response = await this.sendRequest(mutation, {
      input: { refreshToken: refreshToken },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data.data.refreshToken
  }

  async updateSkin(
    profileId: string,
    name: string,
    gender: string,
    hairStyle: string,
    color: string,
    outfit: string,
  ) {
    const mutation = `
    mutation UpdateSkin($input: UpdateCharacter!) {
      updateSkin(input: $input) {
        gender
        hair_style
        color
        outfit
      }
    }
  `

    const response = await this.sendRequest(mutation, {
      input: {
        profileId,
        name,
        character: {
          gender,
          hairStyle,
          color,
          outfit,
        },
      },
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data.data.updateSkin
  }

  async updateChildProfile(profileId: string, firstname: string, dateOfBirth: string) {
    const mutation = `
      mutation UpdateChildProfile($profileId: String!, $firstname: String!, $dateOfBirth: Date!) {
        updateChildProfile(input: {
          profileId: $profileId,
          firstname: $firstname,
          dateOfBirth: $dateOfBirth,
          preferredLanguage: ENGLISH
        }) {
          preferred_language
          lastname
          id
          firstname
          date_of_birth
          character {
            skin {
              outfit
              hair_style
              gender
              color
            }
            name
          }
          avatar_id
        }
      }
    `

    const response = await this.sendRequest(mutation, {
      profileId,
      firstname,
      dateOfBirth,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    console.log("UpdateChildProfileResponse", response.data?.data?.updateChildProfile);
    return response.data?.data?.updateChildProfile
  }

  async deleteChildProfile(profileId: string) {
    const mutation = `
    mutation DeleteChildProfile($profileId: UUID!) {
      deleteChildProfile(profileId: $profileId)
    }
  `

    const response = await this.sendRequest(mutation, { profileId })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }
    console.log("DeleteChildProfileResponse", response.data?.data?.deleteChildProfile);
    return response.data.data.deleteChildProfile
  }

  async updateProgress(childProfileID: string, levelId: string, questionId:string) {
    const mutation = `
      mutation UpdateProgress($childProfileID: UUID!, $levelId: UUID!, $questionId: UUID!) {
        updateProgress(
          input: { childProfileId: $childProfileID, levelId: $levelId, questionId: $questionId }
        ) {
          status
        }
      }
  `

    const response = await this.sendRequest(mutation, { childProfileID, levelId, questionId })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }

    return response.data.data.updateProgress
  }

  /**
   * Fetch levels with their questions based on a child's profile ID.
   * 
   * @param childProfileID UUID of the child's profile.
   * @returns Data containing levels and their related questions.
   */
  async getLevels(childProfileID: string) {
    const query = `
      query GetLevels($childProfileID: UUID!) {
        getLevels(childProfileId: $childProfileID) {
          coordinates {
            latitude
            longitude
          }
          id
          intro {
            en
            es
            fr
          }
          name {
            es
            en
            fr
          }
          questions {
            ... on CryptogramQuestion {
              cryptogramAnswers: answers {
                en
                es
                fr
              }
              cryptoGramCorrectAnswer: correctAnswer {
                en
                fr
                es
              }
              assets {
                id
                path
                role
                type
                url
                description {
                  en
                  es
                  fr
                }
              }
            }
            ... on SingleChoiceQuestion {
              singleChoiceQuestionAnswer: correctAnswer
              singleChoiceQuestionAnswers: answers {
                id
                value {
                  en
                  es
                  fr
                }
              }
              type
              title {
                fr
                es
                en
              }
              id
              assets {
                id
                path
                role
                type
                url
                description {
                  en
                  es
                  fr
                }
              }
            }
            ... on MultichoiceQuestion {
              multichoiceAnswers: answers {
                id
                value {
                  es
                  en
                  fr
                }
              }
              multichoiceCorrectAnswer: correctAnswer
              type
              id
              assets {
                id
                path
                role
                type
                url
                description {
                  en
                  es
                  fr
                }
              }
            }
            ... on WordSearchQuestion {
              wordSearchAnswers: answers {
                es
                fr
                en
              }
              wordSearchCorrectAnswer: correctAnswer {
                en
                es
                fr
              }
              meta {
                en {
                  coordinates {
                    x
                    y
                  }
                  direction
                  length
                }
                es {
                  coordinates {
                    y
                    x
                  }
                  direction
                  length
                }
                fr {
                  coordinates {
                    x
                    y
                  }
                  direction
                  length
                }
              }
              type
              id
              assets {
                url
                type
                role
                path
                id
                description {
                  fr
                  es
                  en
                }
              }
            }
            ... on FillInTheBlanksQuestion {
              fillInTheBlanksAnswer: correctAnswer {
                en
                es
                fr
              }
              assets {
                id
                url
                type
                role
                path
                description {
                  en
                  es
                  fr
                }
              }
            }
            ... on MatchQuestion {
              matchAnswers: answers {
                en
                es
                fr
              }
              matchCorrectAnswer: correctAnswer {
                en
                es
                fr
              }
              assets {
                id
                path
                role
                type
                url
                description {
                  en
                  es
                  fr
                }
              }
            }
            category {
              id
              name {
                en
                es
                fr
              }
              value
            }
            complexity {
              ageGroup
              gradeLevel
            }
            hint {
              en
              es
              fr
            }
            id
            title {
              en
              es
              fr
            }
            type
          }
          assets {
            id
            path
            role
            type
            url
            description {
              en
              es
              fr
            }
          }
          scheduledAt
          completedQuestions {
            id
          }
          isAvailable
          country {
            assets {
              url
              type
              role
              path
              id
              description {
                en
                es
                fr
              }
            }
            name {
              fr
              es
              en
            }
            id
            code
            coordinates {
              latitude
              longitude
            }
          }
          recapDescription {
            en
            es
            fr
          }
        }
      }
    `;

    const response = await this.sendRequest(query, { childProfileID });

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`);
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`);
    }
    
    return response.data as LevelsResponse;
  }

  async createChildProfile(firstname: string, dateOfBirth: string, preferredLanguage: string) {
    const mutation = `
      mutation CreateChildProfile($firstname: String!, $dateOfBirth: Date!, $preferredLanguage: Language!) {
        createChildProfile(input: { firstname: $firstname, dateOfBirth: $dateOfBirth, preferredLanguage: $preferredLanguage }) {
          preferred_language
          lastname
          id
          firstname
          date_of_birth
          character {
            skin {
              outfit
              hair_style
              gender
              color
            }
            name
          }
          avatar_id
        }
      }
    `

    const response = await this.sendRequest(mutation, {
      firstname,
      dateOfBirth,
      preferredLanguage,
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }
    console.log("CreateChildProfileResponse", response.data?.data?.createChildProfile);
    return response.data?.data?.createChildProfile
  }

  async getUser() {
    const query = `
      query MyQuery {
        me {
          id
          username
          updated_at
          profile {
            preferred_language
            lastname
            id
            firstname
            date_of_birth
            avatar_id
          }
          preferences {
            id
            enable_sounds
            enable_notification
            enable_haptics
          }
          id
          email
          created_at
          children(page: 1, first: 10) {
            paginatorInfo {
              total
              perPage
              lastPage
              lastItem
              hasMorePages
              currentPage
              firstItem
              count
            }
            data {
              preferred_language
              lastname
              id
              firstname
              date_of_birth
              character {
                skin {
                  outfit
                  hair_style
                  gender
                  color
                }
                name
              }
              avatar_id
            }
          }
        }
      }
    `

    const response = await this.sendRequest(query, {})

    if (!response.ok) {
      throw new Error(`API error: ${response.problem}`)
    }

    if (response.errors) {
      throw new Error(`GraphQL error: ${response.errors[0].message}`)
    }


    return response.data?.data?.me as User | null
  }

  private async sendRequest(query: string, variables: object) {
    try {
      console.log("Base URL:" + this.apisauce.getBaseURL(), "Variables:", variables)
      const response = await this.apisauce.post("/v1/graphql", { query, variables })
      console.log("response", response.data)
      return response
    } catch (error) {
      return Promise.reject(`Something went wrong: ${error.message || error}`)
    }
  }
}

// Singleton instance of the API for convenience
export const api = new Api()