//// The test entry point: which tests belong to which question of the project.
////
//// `gleam test` runs every test in this directory with gleeunit, as usual;
//// `gleam test -- q1` runs one question's tests and `gleam test -- score`
//// reports every question's. grader.gleam is the whole of that machinery.
//// Problems 9 to 11 are scored on Gradescope, by tests that aren't distributed with
//// the project. The tests for q9 to q11 here only check that the app has the elements
//// that Gradescope's tests look for (test_ids_test.gleam), so they are worth no points
//// here. The checks in autograders.gleam are untimed_checks, since they can take far
//// longer than the grader's timeout. The test for q12 only checks that extension.txt
//// has been filled in, so it's worth no points.
////
//// The tests of Phase 1's questions are listed in interpreter_questions.gleam, which
//// proj/animator-ts shares.

import autograders
import extension_test as extension
import gleam/list
import grader.{check, question, untimed_check}
import interpreter_questions
import test_ids_test as test_ids

pub fn main() -> Nil {
  grader.main(
    list.append(interpreter_questions.all(), [
      question("q9", 0, [
        check("canvas_id_test", test_ids.canvas_id_test),
        check("code_editor_id_test", test_ids.code_editor_id_test),
      ]),
      question("q10", 0, [
        check("shape_slider_id_test", test_ids.shape_slider_id_test),
        check("speed_slider_id_test", test_ids.speed_slider_id_test),
      ]),
      question("q11", 0, [
        check("drawing_select_id_test", test_ids.drawing_select_id_test),
      ]),
      question("q12", 0, [
        check("extension_description_test", extension.description_test),
      ]),
      question("q13", 1, [
        untimed_check(
          "deployment_autograder_test",
          autograders.deployment_autograder_test,
        ),
      ]),
      question("q14", 1, [
        untimed_check(
          "video_autograder_test",
          autograders.video_autograder_test,
        ),
      ]),
    ]),
  )
}
