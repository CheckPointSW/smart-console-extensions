import SmartConsoleInteractions from "smart-console-interactions";
import demoInteraction from "./demo";

const getObjectQueryId = "show-object";
const getObjectsQueryId = "show-objects";
const getObjectsQueryByName = "name";
const getObjectsQueryByTag = "tags";
const getTagsQueryId = "show-tags";
const getTaskQueryId = "show-task";

export const DetailsLevel = {
  Strndard: "standard",
  Full: "full",
  UID: "uid"
};
export const defaultObjectType = "object";

export const TaskStatus = {
  InProgress: "in progress",
  Succeeded: "succeeded",
  Failed: "failed"
};

export class QueryRequest {
  queryId;
  queryParams;
  constructor(queryId, queryParams) {
    this.queryId = queryId;
    this.queryParams = queryParams;
  }
}

export class QueryResponse {
  queryResult;
  constructor(queryResult) {
    this.queryResult = queryResult;
  }
}

export class QueryManager {
  interactions;
  constructor() {
    this.interactions = new SmartConsoleInteractions(demoInteraction);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Retrieve object by object uid
   * @param {string} uid
   * @param {DetailsLevel} detailsLevel
   * @returns {any} requested object
   */
  async getObject(uid, detailsLevel = DetailsLevel.Standard) {
    const queryParams = {
      uid: uid,
      "details-level": detailsLevel
    };

    const queryRequest = new QueryRequest(getObjectQueryId, queryParams);

    try {
      const queryResponse = await this.interactions.query(queryRequest);
      return queryResponse;
    } catch (error) {
      console.error("Failed to get object uid(" + uid + ") - " + error);
      return undefined;
    }
  }

  /**
   * Retrieve objects by object name
   * @param {string} name
   * @param {string} type
   * @param {DetailsLevel} detailsLevel
   * @returns {any} list of objects
   */
  async getObjectsByName(
    name,
    type = defaultObjectType,
    detailsLevel = DetailsLevel.Standard
  ) {
    const queryParams = {
      in: [getObjectsQueryByName, name],
      type: type,
      "details-level": detailsLevel
    };

    const queryRequest = new QueryRequest(getObjectsQueryId, queryParams);

    try {
      const queryResponse = await this.interactions.query(queryRequest);
      return queryResponse;
    } catch (error) {
      console.error("Failed to get objects - " + error);
      return undefined;
    }
  }

  /**
   * Retrieve objects tagged by tag uid
   * @param {string} tag
   * @param {string} type
   * @param {DetailsLevel} detailsLevel
   * @returns {*} list of objects
   */
  async getObjectsByTag(
    tag,
    type = defaultObjectType,
    detailsLevel = DetailsLevel.Standard
  ) {
    const queryParams = {
      in: [getObjectsQueryByTag, tag],
      type: type,
      "details-level": detailsLevel
    };

    const queryRequest = new QueryRequest(getObjectsQueryId, queryParams);

    try {
      const queryResponse = await this.interactions.query(queryRequest);
      return queryResponse;
    } catch (error) {
      console.error("Failed to get objects - " + error);
      return undefined;
    }
  }

  /**
   * Retrieve all tags
   * @param {DetailsLevel} detailsLevel
   * @returns {*} List of tags
   */
  async getTags(detailsLevel = DetailsLevel.Standard) {
    const queryParams = {
      "details-level": detailsLevel
    };

    const queryRequest = new QueryRequest(getTagsQueryId, queryParams);

    try {
      const queryResponse = await this.interactions.query(queryRequest);
      return queryResponse;
    } catch (error) {
      console.error("Failed to get tags - " + error);
      return undefined;
    }
  }

  /**
   * Retrieve task by query request
   * @param {QueryRequest} queryRequest
   * @returns {any} Task object
   */
  async getTaskInternal(queryRequest) {
    try {
      let queryResponse = await this.interactions.query(queryRequest);
      return queryResponse;
    } catch (error) {
      console.error("Failed to get task - " + error);
      return undefined;
    }
  }

  /**
   * Retrieve task by task uid
   * @param {string} uid
   * @param {DetailsLevel} detailsLevel
   * @param {boolean} wait - wait for task completion
   * @returns {any} Task object
   */
  async getTask(uid, detailsLevel = DetailsLevel.Standard, wait = true) {
    const queryParams = {
      "task-id": uid,
      "details-level": detailsLevel
    };

    const queryRequest = new QueryRequest(getTaskQueryId, queryParams);

    try {
      let taskResult = await this.getTaskInternal(queryRequest);

      while (wait && taskResult.tasks[0].status === TaskStatus.InProgress) {
        await this.sleep(5000);
        taskResult = await this.getTaskInternal(queryRequest);
      }

      return taskResult.tasks[0];
    } catch (error) {
      console.error("Failed to get task (" + uid + ") - " + error);
      return undefined;
    }
  }

  /**
   * Request SmartConsole user to execute passed commands
   * @param {[string]} commands
   * @returns {Promise[string]} list of commands result in a matching order
   */
  async requestCommit(commands) {
    try {
      const result = await this.interactions.requestCommit(commands);
      return result;
    } catch (error) {
      console.error("requestCommit error:" + error);
      throw error;
    }
  }

  /**
   * Retrieve SmartConsole context
   * @returns {any} Context received from SmartConsole
   */
  async getContextObject() {
    try {
      const result = await this.interactions.getContextObject();
      console.log(JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("getContextObject error:" + error);
      throw error;
    }
  }

  /**
   * Check if extension is runing inside SmartConsole
   * @returns {boolean} true is running inside SmartConsole. otherwise false.
   */
  isSmartConsoleMode() {
    return this.interactions.invoker.isSmartConsoleMode();
  }
}
