//# sourceMappingURL=animator_test.mjs.map
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $autograders from "./autograders.mjs";
import * as $extension from "./extension_test.mjs";
import { List$Empty$const as $List$Empty$const, prepend as listPrepend } from "./gleam.mjs";
import * as $grader from "./grader.mjs";
import { check, question, untimed_check } from "./grader.mjs";
import * as $interpreter_questions from "./interpreter_questions.mjs";
import * as $test_ids from "./test_ids_test.mjs";

export function main() {
  return $grader.main(
    $list.append(
      $interpreter_questions.all(),
      listPrepend(
        question(
          "q9",
          0,
          listPrepend(
            check("canvas_id_test", $test_ids.canvas_id_test),
            listPrepend(
              check("code_editor_id_test", $test_ids.code_editor_id_test),
              $List$Empty$const,
            ),
          ),
        ),
        listPrepend(
          question(
            "q10",
            0,
            listPrepend(
              check("shape_slider_id_test", $test_ids.shape_slider_id_test),
              listPrepend(
                check("speed_slider_id_test", $test_ids.speed_slider_id_test),
                $List$Empty$const,
              ),
            ),
          ),
          listPrepend(
            question(
              "q11",
              0,
              listPrepend(
                check(
                  "drawing_select_id_test",
                  $test_ids.drawing_select_id_test,
                ),
                $List$Empty$const,
              ),
            ),
            listPrepend(
              question(
                "q12",
                0,
                listPrepend(
                  check(
                    "extension_description_test",
                    $extension.description_test,
                  ),
                  $List$Empty$const,
                ),
              ),
              listPrepend(
                question(
                  "q13",
                  1,
                  listPrepend(
                    untimed_check(
                      "deployment_autograder_test",
                      $autograders.deployment_autograder_test,
                    ),
                    $List$Empty$const,
                  ),
                ),
                listPrepend(
                  question(
                    "q14",
                    1,
                    listPrepend(
                      untimed_check(
                        "video_autograder_test",
                        $autograders.video_autograder_test,
                      ),
                      $List$Empty$const,
                    ),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
